export default function Checkmark() {
  return (
    <div
      title="Mark as read"
      onClick={(e) => {
        // todo: click event reaches parent card
        e.stopPropagation();
        console.log("marked as read");
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
        <path d="m9.55 17.3-4.975-4.95.725-.725 4.25 4.25 9.15-9.15.725.725Z" />
      </svg>
    </div>
  );
}
