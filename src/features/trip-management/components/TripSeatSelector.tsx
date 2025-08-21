import React from "react";
import { Row, Col, Button, Tooltip, Space, Typography, Tabs } from "antd";
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
}

const TripSeatSelector: React.FC<TripSeatSelectorProps> = ({
  seatConfig,
  selectedSeats,
  onSeatSelect,
  availableSeats,
  seatStatuses = [], // Default to empty array
}) => {
  // Map seat statuses from API to a more efficient lookup
  const seatStatusMap = React.useMemo(() => {
    const map = new Map<string, string>();
    seatStatuses.forEach((seat) => {
      map.set(seat.seatNumber, seat.status);
    });
    return map;
  }, [seatStatuses]);

  // Generate unavailable seats based on API data if available, or fallback to random generation
  const unavailableSeats = React.useMemo(() => {
    // If we have seat statuses from API
    if (seatStatuses.length > 0) {
      const seats = new Set<string>();
      seatStatuses.forEach((seat) => {
        if (seat.status !== "available") {
          seats.add(seat.seatNumber);
        }
      });
      return seats;
    }

    // Fallback to random generation if no API data
    const totalSeats = seatConfig.cols * seatConfig.rows * seatConfig.floors;
    const unavailableCount = totalSeats - availableSeats;
    const seats = new Set<string>();

    while (seats.size < unavailableCount) {
      const floor = 1; // We only have one floor as per the mock data
      const row = Math.floor(Math.random() * seatConfig.rows) + 1;
      const col = Math.floor(Math.random() * seatConfig.cols) + 1;
      const seatId = `${floor}-${row}-${col}`;
      seats.add(seatId);
    }

    return seats;
  }, [seatConfig, availableSeats, seatStatuses]);

  const getSeatLabel = (row: number, col: number): string => {
    return `${String.fromCharCode(64 + row)}${col}`;
  };

  const renderSeat = (row: number, col: number, floor: number) => {
    const seatId = `${floor}-${row}-${col}`;
    const seatLabel = getSeatLabel(row, col);

    // Check seat status from API first, then fallback to generated data
    const isUnavailable = seatStatusMap.has(seatLabel)
      ? seatStatusMap.get(seatLabel) !== "available"
      : unavailableSeats.has(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <Col span={6} key={seatId} style={{ padding: 4 }}>
        <Tooltip title={isUnavailable ? "Ghế đã được đặt" : `Ghế ${seatLabel}`}>
          <Button
            type={isSelected ? "primary" : "default"}
            danger={isUnavailable}
            disabled={isUnavailable}
            style={{
              width: "100%",
              height: 40,
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
              border: isUnavailable
                ? "1px dashed #d9d9d9"
                : "1px solid #d9d9d9",
            }}
            onClick={() => !isUnavailable && onSeatSelect(seatId)}
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
        <Space>
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
