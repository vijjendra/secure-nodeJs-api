import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Constants for summary calculations
 */
const SUMMARY_CONSTANTS = {
  DEFAULT_SALT_ROUNDS: 10,
  DEFAULT_ID_LENGTH: 12,
} as const;

/**
 * Utility class for common operations
 */
export class generalUtilities {
  /**
   * Encrypts a password using bcrypt
   * @param password Plain text password
   * @param saltRounds Number of salt rounds (default: 10)
   * @returns Promise<string> Hashed password
   */
  static async encryptedPassword(
    password: string,
    saltRounds: number = SUMMARY_CONSTANTS.DEFAULT_SALT_ROUNDS
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }



  /**
   * Removes ellipsis dots from text
   * @param text Text to process
   * @returns Processed text
   */
  static removeEllipsisDots(text: string): string {
    return text.replace(/\.{3,}$/, "").trim();
  }

  /**
   * Truncates text with ellipsis
   * @param text Text to truncate
   * @param length Maximum length
   * @param trimDots Whether to trim dots
   * @returns Truncated text
   */
  static truncateWithEllipsis(
    text: string,
    length: number,
    trimDots: boolean = true
  ): string {
    const truncated = text.slice(0, length);
    return trimDots ? this.removeEllipsisDots(truncated) : truncated;
  }

  /**
   * Adds ellipsis to text
   * @param text Text to process
   * @returns Text with ellipsis
   */
  static addEllipsis(text: string): string {
    return text.trim() + "...";
  }

  /**
   * Generates a secure short ID
   * @param length ID length
   * @param prefix Optional prefix
   * @returns Secure ID
   */
  static generateShortSecureId(
    length: number = SUMMARY_CONSTANTS.DEFAULT_ID_LENGTH,
    prefix?: string
  ): string {
    const bytes = crypto.randomBytes(Math.ceil((length * 3) / 4));
    const id = bytes
      .toString("base64")
      .replace(/[+/=]/g, (char) => {
        switch (char) {
          case "+":
            return "-";
          case "/":
            return "_";
          case "=":
            return "";
          default:
            return char;
        }
      })
      .substring(0, length);

    const cleanPrefix = prefix?.trim().replace(/^_+|_+$/g, "");
    return cleanPrefix ? `${cleanPrefix}_${id}` : id;
  }
  static formatFullName(
    firstName?: string,
    middleName?: string,
    lastName?: string
  ): string {
    return [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
  }
}

export default generalUtilities;
