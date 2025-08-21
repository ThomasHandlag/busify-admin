/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
	Card,
	Form,
	Input,
	Button,
	Table,
	Space,
	Typography,
	Tag,
	Row,
	Col,
	Statistic,
	Alert,
	Breadcrumb,
	Empty,
	Tooltip,
	message,
	Select,
	DatePicker,
	TimePicker,
	Rate,
	Badge,
} from "antd";
import {
	SearchOutlined,
	EyeOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
	UserOutlined,
	DollarOutlined,
	ClearOutlined,
	CarOutlined,
	WifiOutlined,
	SnippetsOutlined,
	ThunderboltOutlined,
	DesktopOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import TripDetailModal from "./components/TripDetailModal";
import type { Trip } from "../../app/api/trip";
import {
	getAllTrips,
	filterTrips,
	type TripFilterParams,
} from "../../app/api/trip";

const { Title, Text } = Typography;
const { Option } = Select;

// Add palette
const PALETTE = {
	primary: "#1f6feb",
	success: "#27ae60",
	warning: "#f39c12",
	danger: "#e74c3c",
	accent: "#6f42c1",
	muted: "#6b7280",
	border: "#d9d9d9",
};

const TripWithCustomerServicePage: React.FC = () => {
	const [form] = Form.useForm();
	const [searchResults, setSearchResults] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [hasSearched, setHasSearched] = useState(false);
	const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load initial data on component mount
	useEffect(() => {
		loadAllTrips();
	}, []);

	const loadAllTrips = async () => {
		try {
			setInitialLoading(true);
			setError(null);
			const response = await getAllTrips();
			if (response.code === 200) {
				setSearchResults(response.result);
			} else {
				setError(response.message || "Không thể tải dữ liệu");
				message.error(response.message || "Không thể tải dữ liệu");
			}
		} catch (error) {
			setError("Lỗi kết nối đến server");
			message.error("Lỗi kết nối đến server");
			console.error("Error loading trips:", error);
		} finally {
			setInitialLoading(false);
		}
	};

	const handleSearch = async (values: any) => {
		const {
			startLocation,
			endLocation,
			departureDate,
			departureTime,
			status,
			minSeats,
		} = values;

		setLoading(true);
		setHasSearched(true);
		setError(null);

		try {
			// Prepare filter params
			const filterParams: TripFilterParams = {};

			if (departureDate) {
				filterParams.departureDate = dayjs(departureDate).format("YYYY-MM-DD");
			}

			if (departureTime) {
				filterParams.untilTime = dayjs(departureTime).format("HH:mm");
			}

			if (minSeats) {
				filterParams.availableSeats = parseInt(minSeats);
			}

			const response = await filterTrips(filterParams);

			if (response.code === 200) {
				let results = response.result;

				// Apply client-side filtering for fields not supported by API
				if (startLocation) {
					results = results.filter((trip) =>
						trip.route.start_location
							.toLowerCase()
							.includes(startLocation.toLowerCase())
					);
				}
				if (endLocation) {
					results = results.filter((trip) =>
						trip.route.end_location
							.toLowerCase()
							.includes(endLocation.toLowerCase())
					);
				}
				if (status) {
					results = results.filter((trip) => trip.status === status);
				}

				setSearchResults(results);

				if (results.length === 0) {
					message.info("Không tìm thấy chuyến đi phù hợp");
				} else {
					message.success(`Tìm thấy ${results.length} chuyến đi`);
				}
			} else {
				setError(response.message || "Không thể tìm kiếm chuyến đi");
				message.error(response.message || "Không thể tìm kiếm chuyến đi");
			}
		} catch (error) {
			setError("Lỗi kết nối đến server");
			message.error("Lỗi kết nối đến server");
			console.error("Error searching trips:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		form.resetFields();
		setHasSearched(false);
		setError(null);
		loadAllTrips();
	};

	const handleViewDetail = (trip: Trip) => {
		setSelectedTrip(trip);
		setIsModalVisible(true);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled":
				return PALETTE.success;
			case "cancelled":
				return PALETTE.danger;
			case "completed":
				return PALETTE.accent;
			case "delayed":
				return PALETTE.warning;
			default:
				return PALETTE.muted;
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "scheduled":
				return "Đã lên lịch";
			case "cancelled":
				return "Đã hủy";
			case "completed":
				return "Hoàn thành";
			case "delayed":
				return "Bị trễ";
			default:
				return status;
		}
	};

	const renderAmenities = (amenities: any) => {
		const amenityList = [];
		if (amenities.wifi) amenityList.push(<WifiOutlined key="wifi" title="WiFi" />);
		if (amenities.air_conditioner) amenityList.push(<SnippetsOutlined key="ac" title="Điều hòa" />);
		if (amenities.usb_charging) amenityList.push(<ThunderboltOutlined key="usb" title="Sạc USB" />);
		if (amenities.tv) amenityList.push(<DesktopOutlined key="tv" title="TV" />);

		return <Space>{amenityList}</Space>;
	};

	const columns: TableProps<Trip>["columns"] = [
		{
			title: "Mã chuyến",
			dataIndex: "trip_id",
			key: "trip_id",
			render: (id) => (
				<Text strong style={{ color: PALETTE.primary }}>
					#{id}
				</Text>
			),
			width: 100,
		},
		{
			title: "Nhà xe",
			dataIndex: "operator_name",
			key: "operator_name",
			render: (name) => (
				<Space>
					<CarOutlined />
					{name}
				</Space>
			),
		},
		{
			title: "Tuyến đường",
			dataIndex: "route",
			key: "route",
			render: (route) => (
				<div>
					<div>
						<EnvironmentOutlined style={{ color: PALETTE.success }} /> {route.start_location}
					</div>
					<div style={{ margin: "4px 0", color: PALETTE.muted }}>↓</div>
					<div>
						<EnvironmentOutlined style={{ color: PALETTE.danger }} /> {route.end_location}
					</div>
				</div>
			),
			width: 300,
		},
		{
			title: "Thời gian",
			key: "time",
			render: (_, record) => (
				<div>
					<div>
						<CalendarOutlined />{" "}
						{dayjs(record.departure_time).format("DD/MM/YYYY")}
					</div>
					<div>
						<ClockCircleOutlined />{" "}
						{dayjs(record.departure_time).format("HH:mm")} -{" "}
						{dayjs(record.arrival_time).format("HH:mm")}
					</div>
				</div>
			),
		},
		{
			title: "Đánh giá",
			dataIndex: "average_rating",
			key: "rating",
			render: (rating) => (
				<div>
					<Rate disabled defaultValue={rating} />
					<div>
						<Text type="secondary">({rating}/5)</Text>
					</div>
				</div>
			),
		},
		{
			title: "Tiện ích",
			dataIndex: "amenities",
			key: "amenities",
			render: renderAmenities,
		},
		{
			title: "Giá vé",
			dataIndex: "price_per_seat",
			key: "price",
			render: (price) => (
				<Space>
					<DollarOutlined />
					<Text strong style={{ color: PALETTE.success }}>
						{price.toLocaleString("vi-VN")} VNĐ
					</Text>
				</Space>
			),
		},
		{
			title: "Ghế trống",
			dataIndex: "available_seats",
			key: "seats",
			render: (seats, record) => (
				<Badge
					count={seats}
					style={{
						backgroundColor:
							record.status === "cancelled" ? PALETTE.danger : seats > 20 ? PALETTE.success : seats > 10 ? PALETTE.warning : PALETTE.danger,
					}}
				>
					<UserOutlined style={{ fontSize: 16 }} />
				</Badge>
			),
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (status) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
		},
		{
			title: "Thao tác",
			key: "action",
			render: (_, record) => (
				<Tooltip title="Xem chi tiết">
					<Button
						type="text"
						icon={<EyeOutlined />}
						onClick={() => handleViewDetail(record)}
					/>
				</Tooltip>
			),
			width: 80,
		},
	];

	// Use palette in stats
	const stats = {
		total: searchResults.length,
		scheduled: searchResults.filter((t) => t.status === "scheduled").length,
		cancelled: searchResults.filter((t) => t.status === "cancelled").length,
		totalSeats: searchResults.reduce((sum, trip) => sum + trip.available_seats, 0),
	};

	return (
		<div style={{ padding: "24px" }}>
			<Breadcrumb
				style={{ marginBottom: "16px" }}
				items={[
					{
						title: "Chăm sóc khách hàng",
					},
					{
						title: "Tra cứu chuyến đi",
					},
				]}
			/>

			<Title level={2} style={{ marginBottom: "24px" }}>
				<CarOutlined /> Tìm kiếm chuyến đi
			</Title>

			{/* Error Alert */}
			{error && (
				<Alert
					message="Lỗi"
					description={error}
					type="error"
					showIcon
					closable
					onClose={() => setError(null)}
					style={{ marginBottom: "24px" }}
					action={
						<Button size="small" onClick={loadAllTrips}>
							Thử lại
						</Button>
					}
				/>
			)}

			{/* Search Form */}
			<Card style={{ marginBottom: "24px" }}>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSearch}
					autoComplete="off"
				>
					<Row gutter={16}>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name="startLocation" label="Điểm khởi hành">
								<Input
									placeholder="Nhập điểm khởi hành"
									prefix={<EnvironmentOutlined />}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name="endLocation" label="Điểm đến">
								<Input
									placeholder="Nhập điểm đến"
									prefix={<EnvironmentOutlined />}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name="departureDate" label="Ngày khởi hành">
								<DatePicker
									style={{ width: "100%" }}
									placeholder="Chọn ngày"
									format="DD/MM/YYYY"
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name="departureTime" label="Giờ khởi hành">
								<TimePicker
									style={{ width: "100%" }}
									placeholder="Chọn giờ"
									format="HH:mm"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item name="status" label="Trạng thái">
								<Select placeholder="Chọn trạng thái" allowClear>
									<Option value="scheduled">Đã lên lịch</Option>
									<Option value="cancelled">Đã hủy</Option>
									<Option value="completed">Hoàn thành</Option>
									<Option value="delayed">Bị trễ</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Form.Item name="minSeats" label="Số ghế tối thiểu">
								<Input
									type="number"
									placeholder="Nhập số ghế"
									prefix={<UserOutlined />}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} lg={8}>
							<Form.Item label=" " style={{ marginBottom: 0 }}>
								<Space>
									<Button
										type="primary"
										htmlType="submit"
										icon={<SearchOutlined />}
										loading={loading}
									>
										Tìm kiếm
									</Button>
									<Button icon={<ClearOutlined />} onClick={handleReset}>
										Xóa bộ lọc
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>

			{/* Search Results Statistics */}
			<Row gutter={16} style={{ marginBottom: "24px" }}>
				<Col xs={24} sm={6}>
					<Card>
						<Statistic
							title="Tổng chuyến đi"
							value={stats.total}
							prefix={<CarOutlined />}
							valueStyle={{ color: PALETTE.primary }}
							loading={initialLoading}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={6}>
					<Card>
						<Statistic title="Đã lên lịch" value={stats.scheduled} valueStyle={{ color: PALETTE.success }} loading={initialLoading} />
					</Card>
				</Col>
				<Col xs={24} sm={6}>
					<Card>
						<Statistic title="Đã hủy" value={stats.cancelled} valueStyle={{ color: PALETTE.danger }} loading={initialLoading} />
					</Card>
				</Col>
				<Col xs={24} sm={6}>
					<Card>
						<Statistic title="Tổng ghế trống" value={stats.totalSeats} prefix={<UserOutlined />} valueStyle={{ color: PALETTE.accent }} loading={initialLoading} />
					</Card>
				</Col>
			</Row>

			{/* Search Results Table */}
			<Card>
				{searchResults.length === 0 && !initialLoading && !loading ? (
					<Empty description="Không có chuyến đi nào" />
				) : (
					<>
						{hasSearched && !loading && (
							<Alert
								message={`Tìm thấy ${searchResults.length} chuyến đi phù hợp`}
								type="success"
								showIcon
								style={{ marginBottom: "16px" }}
							/>
						)}
						{!hasSearched && !initialLoading && (
							<Alert
								message={`Hiển thị tất cả ${searchResults.length} chuyến đi trong hệ thống`}
								type="info"
								showIcon
								style={{ marginBottom: "16px" }}
							/>
						)}
						<Table
							columns={columns}
							dataSource={searchResults}
							rowKey="trip_id"
							loading={loading || initialLoading}
							scroll={{ x: 1400 }}
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total, range) =>
									`${range[0]}-${range[1]} của ${total} chuyến đi`,
							}}
						/>
					</>
				)}
			</Card>

			{/* Trip Detail Modal */}
			<TripDetailModal
				trip={selectedTrip}
				visible={isModalVisible}
				onClose={() => {
					setIsModalVisible(false);
					setSelectedTrip(null);
				}}
			/>
		</div>
	);
};

export default TripWithCustomerServicePage;
