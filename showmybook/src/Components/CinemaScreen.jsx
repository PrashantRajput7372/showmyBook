import React, { useEffect, useMemo, useState } from "react";
import Screen from "./Screen";

function CinemaScreen({
  layout = {
    row: 8,
    seatPerRow: 12,
    aliePosition: 5,
  },
  seatType = {
    regular: { name: "REGULAR", price: 300, row: [0, 1, 2] },
    premium: { name: "PREMIUM", price: 400, row: [3, 4, 5] },
    vip: { name: "VIP", price: 500, row: [6, 7] },
  },
  title = "Welcome to Cinema",
  subTitle = "Movie Name",
  currency = "₹",
  bookedSeat = ["H6"], //["A1","A2"]  //for
  //   bookseat,
}) {
  // DEFAULT COLOR'S FOR SEAT TYPES {REGULAR,PREMIUM,VIP}
  const colors = [
    "blue",
    "yellow",
    "red",
    "green",
    "red",
    "indigo",
    "pink",
    "gray",
  ];

  // Get Which type of seat REGULAR,PREMIUME,VIP
  const getSeatType = (row) => {
    const seatTypeEntries = Object.entries(seatType);

    for (let i = 0; i < seatTypeEntries.length; i++) {
      const [type, config] = seatTypeEntries[i];

      if (config.row.includes(row)) {
        const color = colors[i % colors.length];
        return { type, color, ...config };
      }
    }
  };

  //BASED ON COLOR NAME SET THE CLASS FOR SEATS TO getSeatClass
  const getColorClass = (colorName) => {
    const colorMap = {
      blue: "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200",
      purple:
        "bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200",
      yellow:
        "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200",
      green: "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
      red: "bg-red-500 border-red-900 text-white hover:bg-red-600",
      indigo:
        "bg-indigo-100 border-indigo-300 text-indigo-800 hover:bg-indigo-200",
      pink: "bg-pink-100 border-pink-300 text-pink-800 hover:bg-pink-200",
      gray: "bg-gray-400 border-gray-300 text-gray-800 hover:bg-gray-200",
    };
    return colorMap[colorName] || colorMap.blue;
  };

  //create the initial array for seat layout, Which tell how many row and number of seat with it type,price,status
  const initial = useMemo(() => {
    const seats = [];
    for (let row = 0; row < layout.row; row++) {
      const seatsRow = [];
      const seatTypeInfo = getSeatType(row);
      for (let seat = 0; seat < layout.seatPerRow; seat++) {
        const seatId = String.fromCharCode(65 + row) + (seat + 1);
        seatsRow.push({
          id: seatId,
          row,
          price: seatTypeInfo?.price || 150,
          type: seatTypeInfo?.name || "REGULAR",
          color: seatTypeInfo?.color || "green",
          status: bookedSeat.includes(seatId) ? "booked" : "available",
          selected: false,
        });
      }
      seats.push(seatsRow);
    }
    return seats;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, seatType, bookedSeat]);

  const [seat, setSelectedSeat] = useState(initial);
  const [seatSelected, setSeatSelected] = useState([]);
  

  const totalAmount = useMemo(() => {
    return seatSelected.reduce((total, seat) => total + seat.price, 0); 
  }, [seatSelected]);

  const handleSeatSelection = (row, index) => {
    const newSeat = seat[row][index];
    if (newSeat.status === "booked") return;
    //if seat is already selected then remove it else add it to the array
    console.log(newSeat, "newSeat");
    const currentSelectedArray = seatSelected.some(item=>item.id ===newSeat.id);

    //agar slected seat hai to filter krdo nhi to add krdo ye price
    currentSelectedArray? setSeatSelected(prev => prev.filter(item => (item.id !== newSeat.id))): setSeatSelected(prev=> [...prev,newSeat])
    
    // setSeatSelectedSummary()
    setSelectedSeat((prev) =>(
      prev.map((seatRow, r) =>
        r === row
          ? seatRow.map((seat,i) =>
              i === index ? { ...seat, selected: !seat.selected } : seat
            )
          : seatRow
      )
    ));
  };

  //handle booking of seat
  const handleBooking = () => {
    if(seatSelected.length===0) return;
    alert(`You have booked ${seatSelected.length} seat for ${currency}${totalAmount}`);
    //mark the selected seat as booked
    const updatedSeats = seat.map(row => 
      row.map(seat => 
        seatSelected.some(selectedSeat => selectedSeat.id === seat.id)
          ? { ...seat, status: 'booked', selected: false }
          : seat
      )
    );
    setSelectedSeat(updatedSeats);
    setSeatSelected([]);
  }

  useEffect(() => {
    if (!seatSelected) return;
    console.log("Your have Your selected seat is: ", seatSelected);
    // console.log(seat,"seat");
  }, [seatSelected, seat]);

  //used to render the legend section
  const legend = Object.entries(seatType).map(([type, config], index) => {
    return {
      type,
      color: colors[index % colors.length],
      ...config,
    };
  });

  //this set the class to the div of seats
  const getSeatClass = (seat) => {
    const baseClass = `w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 m-1 rounded-t-lg border-2 cursor-pointer transition-all duration-200  flex justify-center items-center text-xs sm:text font-bold bg-blue-100 border-blue-300 text-blue-800`;

    if (seat.status === "booked") {
      return `${baseClass} bg-gray-400 border-gray-300 text-gray-800 pointer-events-none cursor-not-allowed`;
    }
    if (seat.selected) {
      return `${baseClass} bg-green-100 border-green-300 text-green-800 hover:bg-green-200`;
    }
    return `${baseClass} ${getColorClass(seat.color)}`;
  };

  //for rendering seats
  const renderSeatSection = (row, startIndex, endIndex) => {
    return (
      <div className="flex">
        {row.slice(startIndex, endIndex).map((seat, index) => {
          return (
            <div
              key={seat.id}
              className={getSeatClass(seat)}
              onClick={() => handleSeatSelection(seat.row, startIndex + index)}
            >
              {seat.id}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shoadow-lg p-6 ">
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome TO {title}
        </h1>
        {/* //subtitle */}
        <p className="text-center font-bold text-gray-600 mb-6">{subTitle}</p>
        <div>
          <Screen />
        </div>
        <div className="mb-6 overflow-x-auto ">
          <div className="flex flex-col items-center min-w-max">
            {seat.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex  justify-center items-center mb-2"
              >
                <span className="w-8 text-center items-center   font-bold mr-4 text-gray-400">
                  {String.fromCharCode(65 + rowIndex)}
                </span>

                {renderSeatSection(row, 0, layout.aliePosition)}
                {<div className="w-5"></div>}
                {renderSeatSection(row, layout.aliePosition, layout.seatPerRow)}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-4 bg-gray-200 border border-gray-400 rounded-t-lg">
          {legend.map((seatType) => {
            return (
              <div className="flex items-center" key={seatType.type}>
                <div
                  className={`w-6 h-8 border-2 rounded-t-lg mr-2 ${getColorClass(
                    seatType.color
                  )}`}
                ></div>

                <span className="text-sm">
                  {" "}
                  {seatType.type.toUpperCase()} {currency}
                  {seatType.price}
                </span>
              </div>
            );
          })}
          <div className="flex items-center" key={seatType.type}>
            <div
              className={`w-6 h-8 border-2 rounded-t-lg mr-2 ${getColorClass(
                "gray"
              )}`}
            ></div>

            <span className="text-sm">NOT AVAILABLE</span>
          </div>
          <div className="flex items-center" key={seatType.type}>
            <div
              className={`w-6 h-8 border-2 rounded-t-lg mr-2 ${getColorClass(
                "green"
              )}`}
            ></div>

            <span className="text-sm">SELECTED</span>
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-300 rounded-b-lg">
        <div className="mt-2 text-2xl font-bold items-center">Summary</div>
          <div className="flex items-center "><p className="font-semibold">Selected Seats</p>: {seatSelected.length>0?<p>{seatSelected.map(seat=> seat.id).join(", ")}</p>:<p>No seats selected</p>}</div>
          <div className="flex items-center "><p className="font-semibold">Amount</p>: {currency}{totalAmount}</div>
       <div>
        <button className={` w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all mt-2 disabled:opacity-50 ${seatSelected.length<1?"cursor-not-allowed":""}`} disabled={seatSelected.length===0} onClick={handleBooking}>Book Now</button>
       </div>
          
        </div>
      </div>
    </div>
  );
}

export default CinemaScreen;
