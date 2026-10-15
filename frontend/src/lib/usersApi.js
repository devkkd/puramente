import { api } from "./api";

/**
 * Delete a user (Admin only)
 */
export async function deleteAdminUser(userId) {
  try {
    const response = await api.delete(`/api/auth/admin/users/${userId}`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}
