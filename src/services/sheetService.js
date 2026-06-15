import { supabase } from "@/lib/supabase";

/* =========================
 * SHEETS
 * ========================= */

export async function getSheets() {
  const { data, error } = await supabase
    .from("sheets")
    .select("*")
    .order("created_at");

  if (error) throw error;

  return data ?? [];
}

export async function getSheetByName(name) {
  const { data, error } = await supabase
    .from("sheets")
    .select("*")
    .eq("name", name)
    .single();

  if (error) throw error;

  return data;
}

export async function createSheet(name) {
  const { data, error } = await supabase
    .from("sheets")
    .insert({
      name,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteSheet(sheetId) {
  // xóa cells trước nếu không có cascade
  const { error: cellError } = await supabase
    .from("cells")
    .delete()
    .eq("sheet_id", sheetId);

  if (cellError) throw cellError;

  const { error } = await supabase.from("sheets").delete().eq("id", sheetId);

  if (error) throw error;
}

/* =========================
 * CELLS
 * ========================= */

export async function loadSheet(sheetName) {
  const sheet = await getSheetByName(sheetName);

  const { data, error } = await supabase
    .from("cells")
    .select("*")
    .eq("sheet_id", sheet.id);

  if (error) throw error;

  return {
    sheetId: sheet.id,
    cells: data ?? [],
  };
}

export async function updateCell(sheetId, row, col, value) {
  const { error } = await supabase.from("cells").upsert(
    {
      sheet_id: sheetId,
      row_num: row,
      col_num: col,
      value,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "sheet_id,row_num,col_num",
    },
  );

  if (error) throw error;
}
