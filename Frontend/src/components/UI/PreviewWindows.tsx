import { useState } from "react";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function PreviewWindows() {
  const [currentTime] = useState(new Date()); // hora fija

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Centro - fecha */}
      <span className="text-lg font-semibold mb-2">
        {format(currentTime, "EEEE, MMMM d yyyy")}
      </span>

      {/* Centro - calendario visible grande */}
      <Calendar
        value={currentTime}
        className={`bg-gray-800 text-white rounded-lg shadow-lg w-72 p-2
          [&_button]:text-white [&_button]:hover:bg-gray-700
          [&_tile]:bg-gray-800 [&_tile]:text-white [&_tile]:hover:bg-gray-700
        `}
      />
    </div>
  );
}
