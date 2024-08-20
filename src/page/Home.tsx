import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import CountDate from "../component/CountDate";
import ProgressBar from "../component/ProgressBar";
import { isMobile } from "react-device-detect";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";

function Home() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const address = useTonAddress();
  const [token, setToken] = useState<number>(0);
  const [remainedEnergy, setRemainedEnergy] = useState(25);

  useEffect(() => {
    if (address) {
      fetchData(address);
      fetchTodaysTap(address);
      fetchTotalTap(address);
    }
  }, [address]);

  async function fetchData(walletAddress: string) {
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/tonWallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      await response.json();

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function fetchTodaysTap(walletAddress: string) {
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/getTodaysTap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Todays Tap: ", data);
      setRemainedEnergy(25 - data.count);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function fetchTotalTap(walletAddress: string) {
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/totalTaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Total Tap: ", data);
      data.totalTaps && setToken(data.totalTaps);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function fetchCreateTap(walletAddress: string) {
    try {
      const response = await fetch(`${backendUrl}/api/v1/users/taps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Create Tap: ", data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }



  // const [remainedEnergy, setRemainedEnergy] = useState(25);
  function formatNumberWithCommas(number: number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(number);
  }

  const bodyRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: any) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the target
    const y = event.clientY - rect.top; // y position within the target

    // Step 1: Create and append a <style> element
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    // Step 2: Define the @keyframes animation
    styleElement.sheet &&
      styleElement.sheet.insertRule(
        "@keyframes  fade-out-top-right {0% {opacity: 1; transform: translateY(0); } 100% {opacity: 0;transform: translateY(-100%);}}",
        0
      );

    // Create a new div element
    const newDiv = document.createElement("div");
    newDiv.textContent = "+1";
    newDiv.style.position = "absolute";
    newDiv.style.left = `${x}px`;
    newDiv.style.top = `${y - 50}px`;
    newDiv.style.color = "white";
    newDiv.className =
      "dynamic-div animate-fadeouttopright transform max-sm:text-3xl text-5xl font-bold transition not-selectable"; // You can add Tailwind classes here if needed

    // Append the new div to the body

    bodyRef.current && bodyRef.current.appendChild(newDiv);
    const interval = setTimeout(() => newDiv && newDiv.remove(), 400);

    return () => clearTimeout(interval);
  };

  // useEffect(() => {
  //   // Your effect logic here
  //   const intervalId = setInterval(() => {
  //     setRemainedEnergy((pre) =>
  //       pre >= 24 ? 25 : pre < 25 ? pre + 2 : 25
  //     );
  //   }, 2000);
  //   return () => clearInterval(intervalId);
  // }, []);

  const handleTap = (event: any) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    console.log(event);
    if (remainedEnergy > 0) {
      setRemainedEnergy(remainedEnergy - 1);
      localStorage.setItem("remainedEnergy", String(remainedEnergy - 1));
      fetchCreateTap(address);
      if (token === null) {
        setToken(1);
      } else {
        setToken(token + 1);
      }
      handleClick(event);
    }
  };

  const handleMultiTouchStart = (event: TouchEvent) => {
    // Iterate over each touch point
    Array.from(event.touches).forEach((touch) => {
      console.log("Touch's current position:", touch);
      // Call handleClick for each touch point
      handleClick({
        ...touch,
        target: event.target,
        preventDefault: () => {}, // Mock preventDefault for non-MouseEvent
        clientX: touch.clientX,
        clientY: touch.clientY,
        touches: [],
        targetTouches: [],
        changedTouches: [],
      });
    });
  };

  const handleTouch = (event: any) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    const length = event.touches.length;
    console.log(event, length);
    if (remainedEnergy - length >= 0 && length >= 1) {
      setRemainedEnergy(remainedEnergy - length);
      fetchCreateTap(address);
      setToken(token + length);
      handleMultiTouchStart(event);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative justify-center items-center w-full h-14">
        <TonConnectButton className="absolute right-0" />
      </div>
      {/* <CountDate date={4} /> */}
      <div className="flex flex-col relative items-center justify-between max-sm:h-[80vh]">
        <h1 className="text-4xl font-bold mb-5 max-sm:mb-1 max-sm:text-[2rem]">
          Tap & Earn
        </h1>
        <div className="flex flex-col justify-center items-center not-selectable">
          <h3 className="text-xl font-bold text-[#939392] mb-2">
            $GoXP Balance
          </h3>
          <h1 className="text-5xl">{formatNumberWithCommas(token!)}</h1>
        </div>
        <div
          className={`relative bg-[url('/image/coin_normal.png')] active:bg-[url('/image/coin_active.png')] my-10 max-sm:my-5 rounded-full bg-cover z-50 aspect-square h-[40vh] ${
            remainedEnergy > 0
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }`}
          ref={bodyRef}
          onTouchStart={(e) => {
            if (!isMobile) return;
            handleTouch(e);
          }}
          onClick={(e) => {
            if (isMobile) return;
            handleTap(e);
            console.log("clickEvent: ", e);
          }}
        >
          {/* <img
            src="/image/goxp.png"
            onClick={handleTap}
            alt="toncoin"
            className={`w-[448px] h-[448px] max-sm:w-[240px] max-sm:h-[240px] transition ease-in-out ${
              remainedEnergy > 0
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            } `}
          /> */}
        </div>

        <div>
          <div className="flex flex-col items-center not-selectable w-full">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-gray-500 text-md font-bold">
                Today’s Tap Limit
              </span>
              <h3 className="text-500 text-md font-bold">{remainedEnergy}</h3>
            </div>
            <ProgressBar value={remainedEnergy * 4} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
