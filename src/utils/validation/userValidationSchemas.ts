import type { Rule } from 'antd/es/form';

/**
 * Validation rules cho UserManagerUpdateOrCreateDTO
 * Đồng bộ với backend validation:
 * - fullName: @NotBlank, @Size(min = 2, max = 100)
 * - email: @NotBlank, @Email
 * - phoneNumber: @NotBlank, @Pattern(regexp = "^(0|\\+84)[0-9]{9}$")
 * - address: @Size(max = 255)
 * - roleId: @NotNull, @Positive
 */
export const userManagerValidationRules = {
  fullName: [
    { 
      required: true, 
      message: "Họ và tên không được để trống" 
    },
    { 
      min: 2, 
      message: "Họ và tên phải từ 2 đến 100 ký tự" 
    },
    { 
      max: 100, 
      message: "Họ và tên phải từ 2 đến 100 ký tự" 
    },
    {
      whitespace: true,
      message: "Họ và tên không được chỉ chứa khoảng trắng"
    }
  ] as Rule[],

  email: [
    { 
      required: true, 
      message: "Email không được để trống" 
    },
    { 
      type: "email" as const, 
      message: "Email không hợp lệ" 
    }
  ] as Rule[],

  phoneNumber: [
    { 
      required: true, 
      message: "Số điện thoại không được để trống" 
    },
    {
      pattern: /^(0|\+84)[0-9]{9}$/,
      message: "Số điện thoại không hợp lệ"
    }
  ] as Rule[],

  address: [
    {
      max: 255,
      message: "Địa chỉ không được vượt quá 255 ký tự"
    }
  ] as Rule[],

  roleId: [
    { 
      required: true, 
      message: "ID vai trò không được để trống" 
    },
    {
      validator: (_, value) => {
        if (value && (typeof value !== 'number' || value <= 0)) {
          return Promise.reject(new Error('ID vai trò phải là số dương'));
        }
        return Promise.resolve();
      }
    }
  ] as Rule[]
};

/**
 * Validation rules cho UserUpdateDTO
 * Đồng bộ với backend validation:
 * - fullName: @NotNull
 * - email: @Email
 * - phoneNumber: @Pattern(regexp = "^\\+?[0-9]{10,15}$")
 * - address: @NotNull
 */
export const userUpdateValidationRules = {
  fullName: [
    { 
      required: true, 
      message: "Full name cannot be null" 
    }
  ] as Rule[],

  email: [
    { 
      type: "email" as const, 
      message: "Invalid email format" 
    }
  ] as Rule[],

  phoneNumber: [
    {
      pattern: /^\+?[0-9]{10,15}$/,
      message: "Invalid phone number format"
    }
  ] as Rule[],

  address: [
    { 
      required: true, 
      message: "Address cannot be null" 
    }
  ] as Rule[]
};

/**
 * Validation rules cho RegisterRequestDTO
 * Đồng bộ với backend validation:
 * - email: @NotBlank, @Email
 * - password: @NotBlank, @Min(value = 6)
 */
export const registerValidationRules = {
  name: [
    // Không có validation constraint trong backend, nhưng nên có validation cơ bản
    {
      required: true,
      message: "Tên không được để trống"
    }
  ] as Rule[],

  phoneNumber: [
    // Không có validation constraint trong backend, nhưng nên có validation cơ bản
    {
      required: true,
      message: "Số điện thoại không được để trống"
    },
    {
      pattern: /^(0|\+84)[0-9]{9}$/,
      message: "Số điện thoại không hợp lệ"
    }
  ] as Rule[],

  email: [
    { 
      required: true, 
      message: "Email not blank" 
    },
    { 
      type: "email" as const, 
      message: "Email is not valid" 
    }
  ] as Rule[],

  password: [
    { 
      required: true, 
      message: "Password not blank" 
    },
    { 
      min: 6, 
      message: "Password must be at least 6 characters long" 
    }
  ] as Rule[]
};

/**
 * Custom validator cho số điện thoại Việt Nam
 * Hỗ trợ format: 0xxxxxxxxx hoặc +84xxxxxxxxx
 */
export const validateVietnamesePhoneNumber = {
  validator: (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Số điện thoại không hợp lệ'));
    }
    
    return Promise.resolve();
  }
};

/**
 * Custom validator cho vai trò
 * Đảm bảo roleId là số dương
 */
export const validateRoleId = {
  validator: (_: any, value: number) => {
    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' || value <= 0) {
        return Promise.reject(new Error('ID vai trò phải là số dương'));
      }
    }
    return Promise.resolve();
  }
};

/**
 * Utility function để kết hợp các validation rules
 */
export const combineValidationRules = (...ruleSets: Rule[][]): Rule[] => {
  return ruleSets.flat();
};

/**
 * Validation rules cho TripFilterRequestDTO
 * Đồng bộ với backend validation:
 * - startLocation: @NotNull(message = "Điểm bắt đầu không được để trống")
 * - endLocation: @NotNull(message = "Điểm kết thúc không được để trống")
 * - departureDate: @NotNull(message = "Ngày đi không được để trống")
 * - timeZone: @NotNull, @Pattern(regexp = "^[a-zA-Z0-9_/]+$")
 * - operatorName: @Pattern(regexp = "^[a-zA-Z0-9 ]+$")
 * - availableSeats: @Min(value = 1)
 */
export const tripFilterValidationRules = {
  startLocation: [
    { 
      required: true, 
      message: "Điểm bắt đầu không được để trống" 
    },
    {
      type: "string" as const,
      whitespace: true,
      message: "Điểm bắt đầu không được chỉ chứa khoảng trắng"
    }
  ] as Rule[],

  endLocation: [
    { 
      required: true, 
      message: "Điểm kết thúc không được để trống" 
    },
    {
      type: "string" as const,
      whitespace: true,
      message: "Điểm kết thúc không được chỉ chứa khoảng trắng"
    }
  ] as Rule[],

  departureDate: [
    { 
      required: true, 
      message: "Ngày đi không được để trống" 
    },
    {
      type: "object" as const,
      message: "Vui lòng chọn ngày hợp lệ"
    }
  ] as Rule[],

  timeZone: [
    { 
      required: true, 
      message: "Múi giờ không được để trống" 
    },
    {
      pattern: /^[a-zA-Z0-9_/]+$/,
      message: "Time zone must be in the format 'region/city'"
    }
  ] as Rule[],

  operatorName: [
    {
      pattern: /^[a-zA-Z0-9 ]+$/,
      message: "Operator name can only contain alphanumeric characters and spaces"
    }
  ] as Rule[],

  availableSeats: [
    {
      validator: (_, value) => {
        if (value && (isNaN(value) || parseInt(value) < 1)) {
          return Promise.reject(new Error('Số ghế trống phải lớn hơn 0'));
        }
        return Promise.resolve();
      }
    }
  ] as Rule[]
};

/**
 * Validation rules cho PromotionFilterRequestDTO
 * Đồng bộ với backend validation:
 * - status: @NotNull(message = "Trạng thái khuyến mãi không được để trống")
 * - search: optional
 * - type: optional
 * - minDiscount: optional
 * - maxDiscount: optional
 * - startDate: optional
 * - endDate: optional
 */
export const promotionFilterValidationRules = {
  status: [
    { 
      required: true, 
      message: "Trạng thái khuyến mãi không được để trống" 
    }
  ] as Rule[],

  search: [] as Rule[],

  type: [] as Rule[],

  minDiscount: [
    {
      validator: (_, value) => {
        if (value !== undefined && value !== null && (isNaN(value) || parseFloat(value) < 0)) {
          return Promise.reject(new Error('Giá trị giảm tối thiểu phải lớn hơn hoặc bằng 0'));
        }
        return Promise.resolve();
      }
    }
  ] as Rule[],

  maxDiscount: [
    {
      validator: (_, value) => {
        if (value !== undefined && value !== null && (isNaN(value) || parseFloat(value) < 0)) {
          return Promise.reject(new Error('Giá trị giảm tối đa phải lớn hơn hoặc bằng 0'));
        }
        return Promise.resolve();
      }
    }
  ] as Rule[],

  discountRange: [
    {
      validator: (_, value) => {
        if (value && Array.isArray(value) && value.length === 2) {
          const [min, max] = value;
          if (min !== undefined && max !== undefined && min > max) {
            return Promise.reject(new Error('Giá trị giảm tối thiểu không được lớn hơn giá trị tối đa'));
          }
        }
        return Promise.resolve();
      }
    }
  ] as Rule[],

  startDate: [] as Rule[],

  endDate: [] as Rule[],

  dateRange: [
    {
      validator: (_, value) => {
        if (value && Array.isArray(value) && value.length === 2) {
          const [startDate, endDate] = value;
          if (startDate && endDate && startDate.isAfter(endDate)) {
            return Promise.reject(new Error('Ngày bắt đầu không được sau ngày kết thúc'));
          }
        }
        return Promise.resolve();
      }
    }
  ] as Rule[]
};

/**
 * Validation rules cho PromotionRequestDTO
 * Đồng bộ với backend validation:
 * - discountValue: @NotNull(message = "Giá trị giảm giá không được để trống")
 * - startDate: @NotNull + @FutureOrPresent
 * - endDate: @NotNull + @Future
 */
export const promotionRequestValidationRules = {
  discountValue: [
    { 
      required: true, 
      message: "Giá trị giảm giá không được để trống" 
    },
    {
      type: "number" as const,
      min: 0.01,
      message: "Giá trị phải lớn hơn 0"
    }
  ] as Rule[],

  dateRange: [
    { 
      required: true, 
      message: "Thời gian hiệu lực không được để trống" 
    },
    {
      validator: (_, value) => {
        if (!value || !Array.isArray(value) || value.length !== 2) {
          return Promise.reject(new Error('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc'));
        }
        
        const [startDate, endDate] = value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Validate startDate: @FutureOrPresent (hôm nay hoặc trong tương lai)
        if (startDate && startDate.toDate() < today) {
          return Promise.reject(new Error('Ngày bắt đầu phải là hôm nay hoặc trong tương lai'));
        }
        
        // Validate endDate: @Future (trong tương lai)
        if (endDate && endDate.toDate() <= today) {
          return Promise.reject(new Error('Ngày kết thúc phải là trong tương lai'));
        }
        
        // Validate startDate <= endDate
        if (startDate && endDate && startDate.isAfter(endDate)) {
          return Promise.reject(new Error('Ngày bắt đầu không được sau ngày kết thúc'));
        }
        
        return Promise.resolve();
      }
    }
  ] as Rule[]
};

/**
 * Validation rules cho PromotionCampaignCreateDTO
 * Đồng bộ với backend validation:
 * - title: @NotBlank + @Size(max = 200)
 * - startDate: @NotNull
 * - endDate: @NotNull
 */
export const promotionCampaignValidationRules = {
  title: [
    { 
      required: true, 
      message: "Tiêu đề không được để trống" 
    },
    {
      max: 200,
      message: "Tiêu đề không được vượt quá 200 ký tự"
    },
    {
      whitespace: true,
      message: "Tiêu đề không được chỉ chứa khoảng trắng"
    }
  ] as Rule[],

  dateRange: [
    { 
      required: true, 
      message: "Thời gian chiến dịch không được để trống" 
    },
    {
      validator: (_, value) => {
        if (!value || !Array.isArray(value) || value.length !== 2) {
          return Promise.reject(new Error('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc'));
        }
        
        const [startDate, endDate] = value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Validate startDate: @NotNull - không được là quá khứ
        if (startDate && startDate.toDate() < today) {
          return Promise.reject(new Error('Ngày bắt đầu không được là quá khứ'));
        }
        
        // Validate endDate: @NotNull - không được là quá khứ  
        if (endDate && endDate.toDate() < today) {
          return Promise.reject(new Error('Ngày kết thúc không được là quá khứ'));
        }
        
        // Validate startDate <= endDate
        if (startDate && endDate && startDate.isAfter(endDate)) {
          return Promise.reject(new Error('Ngày bắt đầu không được sau ngày kết thúc'));
        }
        
        return Promise.resolve();
      }
    }
  ] as Rule[]
};

