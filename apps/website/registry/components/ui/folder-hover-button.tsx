import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

interface FolderHoverButtonProps {
  folderName: string;
  images: string[];
}

function FolderHoverButton({ folderName, images }: FolderHoverButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const handleHoverStart = () => {
    setIsHovered(true);
    controls.start("open");
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    controls.start("closed");
  };

  const maxRotation = 44;
  const rotationStep = maxRotation / (images.length + 1);

  const folderVariants = {
    closed: { rotateX: 0, y: 0, z: 0, zIndex: 1 },
    open: { rotateX: -maxRotation, z: 50, zIndex: 2 },
  };

  const imageVariants = (index: number) => ({
    closed: { rotateX: 0, y: 0, z: 0, opacity: 0 },
    open: {
      rotateX: -maxRotation + (index + 1) * rotationStep,
      z: 30 - index * 5,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.1,
      },
    },
  });

  return (
    <div
      className="relative w-96 h-36 cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      role="button"
      tabIndex={0}
      aria-label={`Open ${folderName} folder`}
    >
      <div
        className="absolute inset-0 flex items-end justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 origin-bottom"
            initial="closed"
            animate={controls}
            variants={imageVariants(index)}
            style={{
              transformStyle: "preserve-3d",
              zIndex: images.length - index + (isHovered ? 2 : 1),
            }}
          >
            <Image
              src={image}
              alt={`Image ${index + 1} in ${folderName} folder`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>
        ))}
        <motion.div
          className="absolute inset-0 bg-black rounded-lg origin-bottom"
          initial="closed"
          animate={controls}
          variants={folderVariants}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            transformStyle: "preserve-3d",
            zIndex: images.length + 1,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold uppercase text-white">
              {folderName}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const FolderHoverButtonDemo = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <FolderHoverButton
        folderName="My Folder"
        images={[
          "https://www.gopx.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fllama-on-disk.6f858965.png&w=3840&q=75",
          "https://www.gopx.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Foctocat-programming.ba4330be.png&w=3840&q=75",
          "https://www.gopx.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin-crash-meme.5c68b41d.png&w=2048&q=75",
          "https://www.gopx.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fllama-on-disk.6f858965.png&w=3840&q=75",
          "https://www.gopx.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Foctocat-programming.ba4330be.png&w=3840&q=75",
          "https://www.gopx.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin-crash-meme.5c68b41d.png&w=2048&q=75",
        ]}
      />
    </div>
  );
};

export default FolderHoverButtonDemo;
