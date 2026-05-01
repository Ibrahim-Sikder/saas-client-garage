"use client"

import { Box } from "@mui/material"
import { motion } from "framer-motion"

export const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => i)

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle}
          style={{
            position: "absolute",
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: "50%",
            background: `linear-gradient(45deg, #06b6d4${Math.floor(
              Math.random() * 100,
            )}, #3b82f6${Math.floor(Math.random() * 100)})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </Box>
  )
}
