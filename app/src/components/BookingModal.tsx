"use client";

import { useState } from "react";
import { Store, EBike } from "@/types";

interface BookingModalProps {
  store: Store;
  bike: EBike;
  type: "test-ride" | "reserve";
  onClose: () => void;
}

const timeSlots = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

function getNextDays(count: number): { label: string; value: string }[] {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() === 0) continue;
    days.push({
      label: date.toLocaleDateString("de-DE", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      value: date.toISOString().split("T")[0],
    });
    if (days.length >= count) break;
  }
  return days;
}

export function BookingModal({ store, bike, type, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const days = getNextDays(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {type === "test-ride" ? "Probefahrt gebucht!" : "Reservierung bestätigt!"}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {type === "test-ride"
              ? `Deine Probefahrt mit dem ${bike.brand} ${bike.model} ist bestätigt.`
              : `Das ${bike.brand} ${bike.model} ist für dich reserviert (48h).`}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {store.name}
            <br />
            {selectedDate && days.find((d) => d.value === selectedDate)?.label} um {selectedTime} Uhr
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Eine Bestätigung wurde an {formData.email} gesendet.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">
              {type === "test-ride" ? "Probefahrt buchen" : "Bike reservieren"}
            </h2>
            <p className="text-sm text-gray-500">
              {bike.brand} {bike.model} · {store.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wähle einen Tag
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {days.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => setSelectedDate(day.value)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedDate === day.value
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wähle eine Uhrzeit
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === slot
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Weiter
                </button>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="font-medium text-gray-900">
                  {days.find((d) => d.value === selectedDate)?.label} um{" "}
                  {selectedTime} Uhr
                </p>
                <p className="text-gray-500">{store.name}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="max@example.de"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+49 170 1234567"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {type === "test-ride" ? "Probefahrt buchen" : "Jetzt reservieren"}
                </button>
              </div>

              {type === "reserve" && (
                <p className="text-xs text-gray-500 text-center">
                  Eine Reservierung hält das Bike 48 Stunden für dich bereit.
                  Keine Anzahlung nötig.
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
