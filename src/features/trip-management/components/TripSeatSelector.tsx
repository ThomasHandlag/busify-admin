import React from "react";
import { Row, Col, Button, Tooltip, Space, Typography, Tabs } from "antd";
import { type SeatStatus } from "../../../app/api/tripSeat";

const { Text } = Typography;

// Add palette for consistent styling
const PALETTE = {
  primary: "#1f6feb", // main brand blue - for selected seats
  success: "#27ae60",
  warning: "#f39c12",
  danger: "#e74c3c",
  surface: "#f5f7fb",
  muted: "#6b7280",
  border: "#d9d9d9",
  disabled: "#d9d9d9",
  booked: "#f39c12", // orange color for booked seats (changed from blue for better distinction)
  locked: "#ff7875", // red color for locked seats
};

interface TripSeatSelectorProps {
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  availableSeats: number;
  seatStatuses?: SeatStatus[]; // Seat statuses from API with new format
  tripStatus?: string;
}

interface ParsedSeat {
  seatNumber: string;
  column: string;
  row: number;
  floor: number;
  status: string;
}

const TripSeatSelector: React.FC<TripSeatSelectorProps> = ({
  selectedSeats,
  onSeatSelect,
  seatStatuses = [],
  tripStatus = "scheduled",
}) => {
  // Check if trip is bookable based on status
  const isTripBookable = React.useMemo(() => {
    return ["on_sell"].includes(tripStatus); // Only on_sell trips are bookable
  }, [tripStatus]);

  // Parse seat data from new format (e.g., "A.1.1" -> {column: "A", row: 1, floor: 1})
  const parsedSeats = React.useMemo(() => {
    const seats: ParsedSeat[] = [];

    seatStatuses.forEach((seat) => {
      const parts = seat.seatNumber.split(".");
      if (parts.length === 3) {
        const [column, rowStr, floorStr] = parts;
        const row = parseInt(rowStr);
        const floor = parseInt(floorStr);

        if (!isNaN(row) && !isNaN(floor)) {
          seats.push({
            seatNumber: seat.seatNumber,
            column,
            row,
            floor,
            status: seat.status,
          });
        }
      }
    });

    return seats;
  }, [seatStatuses]);

  // Group seats by floor and organize them for rendering
  const seatsByFloor = React.useMemo(() => {
    const floors: {
      [key: number]: { [key: string]: { [key: number]: ParsedSeat } };
    } = {};

    parsedSeats.forEach((seat) => {
      if (!floors[seat.floor]) {
        floors[seat.floor] = {};
      }
      if (!floors[seat.floor][seat.column]) {
        floors[seat.floor][seat.column] = {};
      }
      floors[seat.floor][seat.column][seat.row] = seat;
    });

    return floors;
  }, [parsedSeats]);

  // Get available columns and rows from actual data
  const { availableColumns, maxRows, availableFloors } = React.useMemo(() => {
    const columns = new Set<string>();
    let maxRow = 0;
    const floors = new Set<number>();

    parsedSeats.forEach((seat) => {
      columns.add(seat.column);
      maxRow = Math.max(maxRow, seat.row);
      floors.add(seat.floor);
    });

    return {
      availableColumns: Array.from(columns).sort(),
      maxRows: maxRow,
      availableFloors: Array.from(floors).sort((a, b) => a - b),
    };
  }, [parsedSeats]);

  const renderSeat = (column: string, row: number, floor: number) => {
    const seat = seatsByFloor[floor]?.[column]?.[row];
    const seatNumber = seat ? seat.seatNumber : `${column}.${row}.${floor}`;
    const seatLabel = `${column}${row}`;

    // If no seat data exists, don't render anything (empty space)
    if (!seat) {
      return (
        <Col
          span={6}
          key={`empty-${column}-${row}-${floor}`}
          style={{ padding: 4 }}
        >
          <div style={{ height: 40 }} />
        </Col>
      );
    }

    const isUnavailable = seat.status !== "available";
    const isSelected = selectedSeats.includes(seatNumber);
    const isBooked = seat.status === "booked";
    const isLocked = seat.status === "locked";

    // Determine seat styling based on trip status and seat status
    let seatStyle = {};
    let seatType: "primary" | "default" = "default"; // Explicitly type seatType
    let seatDisabled = isUnavailable;

    if (!isTripBookable) {
      // Trip is not bookable - all seats disabled
      seatDisabled = true;

      if (isBooked) {
        seatStyle = {
          backgroundColor: PALETTE.booked,
          color: "white",
          border: `1px solid ${PALETTE.booked}`,
        };
      } else if (isLocked) {
        seatStyle = {
          backgroundColor: PALETTE.locked,
          color: "white",
          border: `1px solid ${PALETTE.locked}`,
        };
      } else {
        seatStyle = {
          backgroundColor: PALETTE.disabled,
          color: PALETTE.muted,
          border: `1px dashed ${PALETTE.border}`,
        };
      }
    } else {
      // Trip is bookable - use normal styling
      if (isSelected) {
        seatStyle = {
          backgroundColor: PALETTE.primary,
          color: "white",
          border: `1px solid ${PALETTE.primary}`,
        };
        seatType = "primary";
      } else if (isBooked) {
        seatStyle = {
          backgroundColor: PALETTE.booked,
          color: "white",
          border: `1px solid ${PALETTE.booked}`,
        };
      } else if (isLocked) {
        seatStyle = {
          backgroundColor: PALETTE.locked,
          color: "white",
          border: `1px solid ${PALETTE.locked}`,
        };
      } else {
        // Available seat
        seatStyle = {
          backgroundColor: "white",
          color: "rgba(0, 0, 0, 0.65)",
          border: `1px solid ${PALETTE.border}`,
        };
      }
    }

    const getTooltipText = () => {
      if (!isTripBookable) {
        if (isBooked) return "Ghế đã được đặt";
        if (isLocked) return "Ghế bị khóa";
        return "Chuyến đi không khả dụng";
      }

      if (isBooked) return "Ghế đã được đặt";
      if (isLocked) return "Ghế bị khóa";
      return `Ghế ${seatLabel}`;
    };

    return (
      <Col span={6} key={seatNumber} style={{ padding: 4 }}>
        <Tooltip title={getTooltipText()}>
          <Button
            type={seatType}
            disabled={seatDisabled}
            style={{
              width: "100%",
              height: 40,
              ...seatStyle,
            }}
            onClick={() =>
              isTripBookable &&
              seat.status === "available" &&
              onSeatSelect(seatNumber)
            }
          >
            {seatLabel}
          </Button>
        </Tooltip>
      </Col>
    );
  };

  const renderRow = (rowIndex: number, floor: number) => {
    return (
      <Row key={`row-${floor}-${rowIndex}`} style={{ marginBottom: 8 }}>
        {availableColumns.map((column) => renderSeat(column, rowIndex, floor))}
      </Row>
    );
  };

  const renderFloor = (floorIndex: number) => {
    return (
      <div key={`floor-${floorIndex}`}>
        {Array.from({ length: maxRows }).map((_, rowIndex) =>
          renderRow(rowIndex + 1, floorIndex)
        )}
      </div>
    );
  };

  return (
    <div className="trip-seat-selector">
      {/* Legend */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          {isTripBookable && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: "white",
                    border: `1px solid ${PALETTE.border}`,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế trống</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: PALETTE.primary,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế đã chọn</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: PALETTE.booked,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế đã đặt</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: PALETTE.locked,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế bị khóa</Text>
              </div>
            </>
          )}
          {!isTripBookable && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: PALETTE.disabled,
                    border: `1px solid ${PALETTE.border}`,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế không khả dụng</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: PALETTE.booked,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế đã đặt trước đó</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: PALETTE.locked,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế bị khóa</Text>
              </div>
            </>
          )}
        </Space>
      </div>

      <div className="bus-layout">
        {/* Front of bus indicator */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 16,
            padding: 8,
            backgroundColor: PALETTE.surface,
            borderRadius: 4,
          }}
        >
          <Text strong>Phía trước xe</Text>
        </div>

        {/* Floors in Tabs - only show if there are floors */}
        {availableFloors.length > 0 && (
          <Tabs
            defaultActiveKey={availableFloors[0]?.toString()}
            items={availableFloors.map((floor) => ({
              key: floor.toString(),
              label: `Tầng ${floor}`,
              children: renderFloor(floor),
            }))}
            tabBarStyle={{ marginBottom: 16 }}
            animated={true}
            size="small"
            type="card"
          />
        )}

        {/* Show message if no seat data */}
        {availableFloors.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: PALETTE.muted,
            }}
          >
            <Text>Không có dữ liệu ghế</Text>
          </div>
        )}

        {/* Back of bus indicator */}
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            padding: 8,
            backgroundColor: PALETTE.surface,
            borderRadius: 4,
          }}
        >
          <Text strong>Phía sau xe</Text>
        </div>
      </div>
    </div>
  );
};

export default TripSeatSelector;
