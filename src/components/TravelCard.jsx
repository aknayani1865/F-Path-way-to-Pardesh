import React from 'react';
import { CalendarIcon, MapPinIcon, Hotel, Bus, DollarSign, ArrowRight } from "lucide-react";

const TravelCard = ({
  packageName = "Summer Getaway",
  source = "New York",
  destination = "Maldives",
  hotel = "Paradise Resort",
  transport = "Flight",
  startDate = "2023-07-01",
  endDate = "2023-07-10",
  totalPrice = 2500,
  totalDistance = "8,700 miles",
  image
}) => {
  return (
    <div className="w-full max-w-md overflow-hidden shadow-lg rounded-lg border border-gray-200">
      <div className="relative h-48">
        <img
          alt={destination || 'Unknown'}
          className="object-cover w-full h-full"
          height="192"
          src={image || "/placeholder.svg?height=192&width=384"}
          style={{
            aspectRatio: "384/192",
            objectFit: "cover",
          }}
          width="384"
        />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{packageName || 'Unknown'}</h2>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center text-gray-700">
            <MapPinIcon className="w-5 h-5 mr-2" />
            {source || 'Unknown'}
          </span>
          <ArrowRight className="w-5 h-5 mx-2 text-gray-700" />
          <span className="flex items-center text-gray-700">
            <MapPinIcon className="w-5 h-5 mr-2" />
            {destination || 'Unknown'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-700">
            <Hotel className="w-5 h-5 mr-2" />
            <span>{hotel || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Bus className="w-5 h-5 mr-2" />
            <span>{transport || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <span>{startDate || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <span>{endDate || 'Unknown'}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {totalDistance || 'Unknown'}
          </span>
          <div className="flex items-center font-bold text-lg text-gray-700">
            <DollarSign className="w-5 h-5 mr-1" />
            {totalPrice || 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCard;