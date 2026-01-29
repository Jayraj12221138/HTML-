# HTML- IN this i add a new project that is   3D  animation particles 
Gesture-Controlled 3D Particle Animation System
Project Overview

This project is an interactive 3D particle animation system built using Three.js and MediaPipe Hands. It visualizes thousands of particles in real-time 3D space and allows users to control particle behavior using hand gestures detected via a webcam.

The system dynamically morphs particles into multiple predefined 3D shapes and responds interactively to different hand gestures such as open hand, fist, and pinch.

Key Features

Real-time 3D particle rendering using WebGL

AI-based hand tracking using MediaPipe Hands

Multiple particle shape templates:

Sphere

Heart

Saturn (planet with rings)

Fireworks

Gesture-based interaction:

Open hand: Particles maintain their shape

Fist gesture: Particles are attracted toward the hand

Pinch gesture: Switches between particle templates

Smooth animation with GPU-accelerated rendering

Responsive full-screen visualization

Technologies Used

HTML & CSS – Page structure and UI styling

JavaScript – Core logic and animation loop

Three.js – 3D rendering and particle system

WebGL – High-performance graphics rendering

MediaPipe Hands – Real-time hand gesture detection

Web Camera API – Live video input for gesture tracking

How It Works

A Three.js scene is initialized with a perspective camera and WebGL renderer.

Thousands of particles are created using BufferGeometry for performance efficiency.

Each particle has a target position depending on the selected shape template.

MediaPipe detects hand landmarks from the webcam feed in real time.

Based on detected gestures:

Particles either follow their predefined shape

Or dynamically move toward the user’s hand

Or switch to a new shape template

The animation loop updates particle positions and colors smoothly for a realistic 3D effect.

Applications

Interactive web-based visualizations

Creative coding and digital art

Human–computer interaction experiments

Educational demonstrations of 3D graphics and AI integration

Game and simulation effects

How to Run the Project

Clone the repository

Open the HTML file in a modern browser (Chrome recommended)

Allow camera access when prompted

Use hand gestures in front of the camera to interact with particles
