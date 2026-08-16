/**
 * Line-based cordis.patch.yml editing. Only the target row's `disabled:` line
 * is ever touched, so comments, !!js expressions, and unrelated rows survive
 * byte-for-byte. Block shape handled:
 *
 *   - id: <entryId>          <- block start (column 0, optional indent)
 *     disabled: true|false   <- indented body lines until the next top-level item
 *     config: ...
 */
import type { PatchState } from './contract.ts';
/**
 * Set or clear the `disabled:` field of one patch row.
 * @param text - current patch file content.
 * @param entryId - the loader row id to target.
 * @param disabled - the desired enablement.
 * @returns the patched content.
 */
export declare function upsertDisabled(text: string, entryId: string, disabled: boolean): string;
/** Read the user-patch state of one row. */
export declare function patchStateOf(text: string, entryId: string): PatchState;
