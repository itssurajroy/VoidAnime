/**
 * Removes all properties with `undefined` values from an object.
 * Firestore `setDoc` and `updateDoc` throw errors if they encounter `undefined`.
 * Use this before sending any complex object (like AnimeCard) to Firestore.
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj } as any;
  Object.keys(result).forEach((key) => {
    if (result[key] === undefined) {
      delete result[key];
    } else if (result[key] !== null && typeof result[key] === 'object' && !Array.isArray(result[key]) && !(result[key] instanceof Date)) {
      // Recursively sanitize nested objects
      result[key] = sanitizeForFirestore(result[key]);
    }
  });
  return result as T;
}
