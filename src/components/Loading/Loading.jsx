import { useEffect, useRef } from "react";

const Loading = () => {
  const ref = useRef(null);
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <div className=" min-h-screen w-[350px] mx-auto ">
      <lottie-player
        id="firstLottie"
        ref={ref}
        autoplay
        loop
        mode="normal"
        src="/loading.json"
        className="animation"
      />
    </div>
  );
};

export default Loading;
