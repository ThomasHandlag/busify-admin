// Export tất cả validation schemas
export * from './userValidationSchemas';

// Types cho validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Utility function để validate dữ liệu theo schema
 */
export const validateData = <T>(_data: T, _schema: any): ValidationResult => {
  const errors: string[] = [];
  
  // Implementation sẽ được thêm vào khi cần thiết
  // Hiện tại sử dụng Ant Design Form validation
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Constants cho validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: {
    FULL_NAME: "Họ và tên không được để trống",
    EMAIL: "Email không được để trống", 
    PHONE_NUMBER: "Số điện thoại không được để trống",
    ADDRESS: "Địa chỉ không được để trống",
    ROLE_ID: "ID vai trò không được để trống",
    NAME: "Tên không được để trống",
    PASSWORD: "Mật khẩu không được để trống"
  },
  
  FORMAT: {
    EMAIL: "Email không hợp lệ",
    PHONE_NUMBER: "Số điện thoại không hợp lệ",
    PASSWORD_MIN_LENGTH: "Mật khẩu phải có ít nhất 6 ký tự"
  },
  
  LENGTH: {
    FULL_NAME_MIN_MAX: "Họ và tên phải từ 2 đến 100 ký tự",
    ADDRESS_MAX: "Địa chỉ không được vượt quá 255 ký tự",
    FULL_NAME_MAX: "Họ và tên không được vượt quá 100 ký tự"
  },
  
  TYPE: {
    ROLE_ID_POSITIVE: "ID vai trò phải là số dương"
  },

  TRIP_FILTER: {
    START_LOCATION_REQUIRED: "Điểm bắt đầu không được để trống",
    END_LOCATION_REQUIRED: "Điểm kết thúc không được để trống", 
    DEPARTURE_DATE_REQUIRED: "Ngày đi không được để trống",
    TIMEZONE_REQUIRED: "Múi giờ không được để trống",
    TIMEZONE_FORMAT: "Time zone must be in the format 'region/city'",
    OPERATOR_NAME_FORMAT: "Operator name can only contain alphanumeric characters and spaces",
    AVAILABLE_SEATS_MIN: "Số ghế trống phải lớn hơn 0"
  }
} as const;