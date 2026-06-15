export default function ColorBox({ color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 18,
        height: 18,
        background: color,
        border: active ? "2px solid #1a73e8" : "1px solid #ddd",
        borderRadius: 3,
        cursor: "pointer",
        padding: 0,
      }}
    />
  );
}
