import React from "react";
import { Row, Col, Button, Tooltip, Space, Typography } from "antd";

const { Text } = Typography;

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
}

const TripSeatSelector: React.FC<TripSeatSelectorProps> = ({
  seatConfig,
  selectedSeats,
  onSeatSelect,
  availableSeats,
}) => {
  // Generate random available/unavailable seats for mock data
  const unavailableSeats = React.useMemo(() => {
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
  }, [seatConfig, availableSeats]);

  const getSeatLabel = (row: number, col: number): string => {
    return `${String.fromCharCode(64 + row)}${col}`;
  };

  const renderSeat = (row: number, col: number, floor: number) => {
    const seatId = `${floor}-${row}-${col}`;
    const isUnavailable = unavailableSeats.has(seatId);
    const isSelected = selectedSeats.includes(seatId);
    const seatLabel = getSeatLabel(row, col);

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
      <div key={`floor-${floorIndex}`} style={{ marginBottom: 16 }}>
        {floorIndex > 1 && <Text strong>Tầng {floorIndex}</Text>}
        {Array.from({ length: seatConfig.rows }).map((_, rowIndex) =>
          renderRow(rowIndex, floorIndex)
        )}
      </div>
    );
  };

  return (
    <div className="trip-seat-selector">
      <div style={{ marginBottom: 16 }}>
        <Space>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "white",
                border: "1px solid #d9d9d9",
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
                backgroundColor: "#1890ff",
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
                backgroundColor: "#f5f5f5",
                border: "1px dashed #d9d9d9",
                marginRight: 8,
              }}
            ></div>
            <Text>Ghế đã đặt</Text>
          </div>
        </Space>
      </div>

      <div className="bus-layout">
        {/* Render front of bus indicator */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 16,
            padding: 8,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
          }}
        >
          <Text strong>Phía trước xe</Text>
        </div>

        {/* Render floors */}
        {Array.from({ length: seatConfig.floors }).map((_, floorIndex) =>
          renderFloor(floorIndex + 1)
        )}

        {/* Render back of bus indicator */}
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            padding: 8,
            backgroundColor: "#f0f0f0",
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
