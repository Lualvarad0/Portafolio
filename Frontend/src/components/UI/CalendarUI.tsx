import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarUI() {
  const [show, setShow] = useState(false);
  const today = new Date();

  return (
    <div className="relative">
      {/* Botón para mostrar calendario */}
      <button
        onClick={() => setShow(!show)}
        className="px-3 py-1 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        {today.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </button>

      {show && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50">
          <Calendar
            className="calendar-custom"
            calendarType="gregory"
          />
        </div>
      )}
    </div>
  );
}
