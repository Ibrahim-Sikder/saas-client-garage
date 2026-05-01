/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { Typography } from "@mui/material"



export const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <Typography
      variant="h2"
      sx={{
        fontWeight: 900,
        background: "linear-gradient(135deg, #67e8f9 0%, #3b82f6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontSize: { xs: "2rem", md: "3rem" },
      }}
    >
      {count.toLocaleString()}
      {suffix}
    </Typography>
  )
}
