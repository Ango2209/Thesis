import * as crypto from 'crypto';

export class HashUtils {
  /**
   * Tạo hash SHA-256 từ một chuỗi hoặc đối tượng
   * @param data - Dữ liệu cần băm, có thể là chuỗi hoặc đối tượng
   * @returns Chuỗi hash
   */
  static hashData(data: string | object): string {
    // Chuyển đổi đối tượng thành chuỗi JSON nếu cần
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);

    // Tạo hash SHA-256
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');

    return hash;
  }

  /**
   * Xác minh hash: So sánh dữ liệu với hash gốc
   */
  static verifyHash(data: string | object, originalHash: string): boolean {
    const newHash = this.hashData(data);
    return newHash === originalHash;
  }
}
