import React from "react";
import {
  Row,
  Col,
  Button,
  Tooltip,
  Space,
  Typography,
  Tabs,
  Alert,
} from "antd";
import { type SeatStatus } from "../../../app/api/tripSeat";

const { Text } = Typography;

// Add palette for consistent styling
const PALETTE = {
  primary: "#1f6feb", // main brand blue
  success: "#27ae60",
  warning: "#f39c12",
  danger: "#e74c3c",
  surface: "#f5f7fb",
  muted: "#6b7280",
  border: "#d9d9d9",
  disabled: "#d9d9d9",
  booked: "#4299e1", // blue color for booked seats in disabled trips
};

interface SeatConfig {
  cols: number;
  rows: number;
  floors: number;
}

interface TripSeatSelectorProps {
  seatConfig: SeatConfig;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  availableSeats: number;
  seatStatuses?: SeatStatus[]; // Add new prop for seat statuses from API
  tripStatus?: string; // Add new prop for trip status
}

const TripSeatSelector: React.FC<TripSeatSelectorProps> = ({
  seatConfig,
  selectedSeats,
  onSeatSelect,
  seatStatuses = [], // Default to empty array
  tripStatus = "scheduled", // Default to scheduled
}) => {
  // Check if trip is bookable based on status
  const isTripBookable = React.useMemo(() => {
    return !["cancelled", "delayed", "departed"].includes(tripStatus);
  }, [tripStatus]);

  // Map seat statuses from API to a more efficient lookup
  const seatStatusMap = React.useMemo(() => {
    const map = new Map<string, string>();
    seatStatuses.forEach((seat) => {
      map.set(seat.seatNumber, seat.status);
    });
    return map;
  }, [seatStatuses]);

  const getSeatLabel = (row: number, col: number): string => {
    return `${String.fromCharCode(64 + row)}${col}`;
  };

  const renderSeat = (row: number, col: number, floor: number) => {
    const seatId = `${floor}-${row}-${col}`;
    const seatLabel = getSeatLabel(row, col);

    // Get seat status from the map
    const status = seatStatusMap.get(seatLabel);
    const isUnavailable = status !== undefined && status !== "available";
    const isSelected = selectedSeats.includes(seatId);

    // Check if this is a booked or locked seat that needs special coloring
    const isBookedOrLocked = status === "booked" || status === "locked";

    // For non-bookable trips, determine the appropriate styling
    let seatStyle = {};
    let seatType = "default";
    let seatDisabled = isUnavailable;

    if (!isTripBookable) {
      // Trip is not bookable (cancelled, delayed, departed)
      seatDisabled = true; // All seats disabled

      if (isBookedOrLocked) {
        // Booked or locked seats in a non-bookable trip get blue color
        seatStyle = {
          backgroundColor: PALETTE.booked,
          color: "white",
          border: `1px solid ${PALETTE.booked}`,
        };
      } else {
        // Other seats get gray color
        seatStyle = {
          backgroundColor: PALETTE.disabled,
          color: PALETTE.muted,
          border: `1px dashed ${PALETTE.border}`,
        };
      }
    } else {
      // Trip is bookable - use normal styling
      seatStyle = {
        backgroundColor: isUnavailable
          ? "#f5f5f5"
          : isSelected
          ? "#1890ff"
          : "white",
        color: isUnavailable
          ? "#999"
          : isSelected
          ? "white"
          : "rgba(0, 0, 0, 0.65)",
        border: isUnavailable ? "1px dashed #d9d9d9" : "1px solid #d9d9d9",
      };
      seatType = isSelected ? "primary" : "default";
    }

    return (
      <Col span={6} key={seatId} style={{ padding: 4 }}>
        <Tooltip
          title={
            !isTripBookable
              ? isBookedOrLocked
                ? "Ghế đã được đặt"
                : "Chuyến đi không khả dụng"
              : isUnavailable
              ? "Ghế đã được đặt"
              : `Ghế ${seatLabel}`
          }
        >
          <Button
            type={seatType}
            danger={isUnavailable && isTripBookable}
            disabled={seatDisabled}
            style={{
              width: "100%",
              height: 40,
              ...seatStyle,
            }}
            onClick={() =>
              isTripBookable && !isUnavailable && onSeatSelect(seatId)
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
        {Array.from({ length: seatConfig.cols }).map((_, colIndex) =>
          renderSeat(rowIndex + 1, colIndex + 1, floor)
        )}
      </Row>
    );
  };

  const renderFloor = (floorIndex: number) => {
    return (
      <div key={`floor-${floorIndex}`}>
        {Array.from({ length: seatConfig.rows }).map((_, rowIndex) =>
          renderRow(rowIndex, floorIndex)
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
                    backgroundColor: PALETTE.surface,
                    border: `1px dashed ${PALETTE.border}`,
                    marginRight: 8,
                  }}
                ></div>
                <Text>Ghế đã đặt</Text>
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

        {/* Floors in Tabs */}
        <Tabs
          defaultActiveKey="1"
          items={Array.from({ length: seatConfig.floors }).map((_, index) => ({
            key: (index + 1).toString(),
            label: `Tầng ${index + 1}`,
            children: renderFloor(index + 1),
          }))}
          tabBarStyle={{ marginBottom: 16 }}
          animated={true}
          size="small"
          type="card"
        />

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
