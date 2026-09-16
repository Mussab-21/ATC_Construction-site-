#!/usr/bin/env python3
"""
generate_blueprint_to_3d.py
===========================
Generates a blueprint-to-3D animation video from a Tripo3D model render video.

Pipeline:
1. Pulls the front elevation frame (default frame 0).
2. Performs edge-detection to trace the exact geometry of the real model.
3. Constructs an architectural blueprint sheet with grid paper, corner crop-marks,
   dimension lines, header, and CAD title block.
4. Generates an ease-out scan-line reveal sequence (~1.6s).
5. Holds on the compiled blueprint (~0.9s).
6. Crossfades/morphs seamlessly into the real 3D render (~0.8s).
7. Continues with the rest of the turntable rotation footage.
"""

import os
import sys
import argparse
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

def get_font(size):
    candidate_paths = [
        "C:/Windows/Fonts/consola.ttf",
        "C:/Windows/Fonts/consolab.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/System/Library/Fonts/Menlo.ttc"
    ]
    for path in candidate_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_blueprint_sheet(frame, width=1080, height=1080):
    """
    Given the source frame, extract edges and overlay onto technical CAD sheet.
    """
    if frame.shape[0] != height or frame.shape[1] != width:
        frame_resized = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)
    else:
        frame_resized = frame.copy()

    # 1. Edge extraction from building render
    gray = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2GRAY)
    blurred = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Canny edge detection
    edges = cv2.Canny(blurred, 30, 110)
    
    # Dilate slightly for crisp visibility
    kernel = np.ones((2, 2), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    # 2. Deep navy blueprint canvas: BGR (54, 28, 10) -> RGB (10, 28, 54)
    bp_bg = np.zeros((height, width, 3), dtype=np.uint8)
    bp_bg[:] = (54, 28, 10)  # BGR

    # Draw grid
    grid_spacing = 36
    grid_color = (80, 48, 20)  # Subtle cyan-navy lines
    for x in range(0, width, grid_spacing):
        cv2.line(bp_bg, (x, 0), (x, height), grid_color, 1)
    for y in range(0, height, grid_spacing):
        cv2.line(bp_bg, (0, y), (width, y), grid_color, 1)

    # 3. Create isolated blueprint line art layer
    line_layer = np.zeros((height, width, 3), dtype=np.uint8)
    line_color = (255, 230, 180)  # Bright cyan/white BGR
    line_layer[edges > 0] = line_color

    # Add soft glow to lines
    glow = cv2.GaussianBlur(line_layer, (5, 5), 0)
    building_bp = cv2.addWeighted(line_layer, 0.85, glow, 0.5, 0)

    # Combine background and lines
    full_bp = cv2.add(bp_bg, building_bp)

    # 4. Add CAD drafting annotations using PIL for crisp typography
    pil_img = Image.fromarray(cv2.cvtColor(full_bp, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img)

    font_title = get_font(24)
    font_sub = get_font(15)
    font_mono = get_font(13)

    cyan = (100, 181, 246)
    faint_cyan = (70, 130, 180)
    white = (240, 240, 240)

    # Outer border
    draw.rectangle([14, 14, width - 14, height - 14], outline=cyan, width=2)
    draw.rectangle([18, 18, width - 18, height - 18], outline=faint_cyan, width=1)

    # Corner crop marks (L-brackets)
    m_len = 32
    # Top-left
    draw.line([(24, 24), (24 + m_len, 24)], fill=cyan, width=2)
    draw.line([(24, 24), (24, 24 + m_len)], fill=cyan, width=2)
    # Top-right
    draw.line([(width - 24, 24), (width - 24 - m_len, 24)], fill=cyan, width=2)
    draw.line([(width - 24, 24), (width - 24, 24 + m_len)], fill=cyan, width=2)
    # Bottom-left
    draw.line([(24, height - 24), (24 + m_len, height - 24)], fill=cyan, width=2)
    draw.line([(24, height - 24), (24, height - 24 - m_len)], fill=cyan, width=2)
    # Bottom-right
    draw.line([(width - 24, height - 24), (width - 24 - m_len, height - 24)], fill=cyan, width=2)
    draw.line([(width - 24, height - 24), (width - 24, height - 24 - m_len)], fill=cyan, width=2)

    # Header
    draw.text((38, 36), "ATC / RESIDENTIAL — ELEVATION A", fill=white, font=font_title)
    draw.text((40, 68), "AZAAN TRADING & CONTRACTING", fill=cyan, font=font_sub)

    # Top dimension line
    dim_y = 250
    draw.line([(40, dim_y), (width - 40, dim_y)], fill=faint_cyan, width=1)
    draw.line([(40, dim_y - 8), (40, dim_y + 8)], fill=faint_cyan, width=1)
    draw.line([(width - 40, dim_y - 8), (width - 40, dim_y + 8)], fill=faint_cyan, width=1)
    draw.text((width // 2 - 40, dim_y - 20), "12.40 M", fill=white, font=font_mono)

    # Bottom-right title block
    tb_w, tb_h = 320, 84
    tb_x0 = width - tb_w - 38
    tb_y0 = height - tb_h - 38
    draw.rectangle([tb_x0, tb_y0, tb_x0 + tb_w, tb_y0 + tb_h], outline=cyan, width=2)
    draw.line([(tb_x0, tb_y0 + 32), (tb_x0 + tb_w, tb_y0 + 32)], fill=faint_cyan, width=1)
    draw.line([(tb_x0, tb_y0 + 58), (tb_x0 + tb_w, tb_y0 + 58)], fill=faint_cyan, width=1)

    draw.text((tb_x0 + 12, tb_y0 + 8), "ATC / 01-VILLA / CAD", fill=white, font=font_sub)
    draw.text((tb_x0 + 12, tb_y0 + 38), "SCALE 1:100     REV 01", fill=faint_cyan, font=font_mono)
    draw.text((tb_x0 + 12, tb_y0 + 64), "STATUS: DESIGN DRAFT", fill=cyan, font=font_mono)

    # Convert back to BGR for OpenCV
    final_bp = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    return final_bp, bp_bg, line_layer

def clean_watermark(f):
    h, w = f.shape[:2]
    clean_f = f.copy()

    # 1. Clean QR Code region (y: 50..295, x: 760..1035) via horizontal mirroring
    qr_y1, qr_y2 = 50, 295
    qr_x1, qr_x2 = 760, 1035
    feather = 20

    qr_mask = np.zeros((h, w), dtype=np.float32)
    qr_mask[qr_y1:qr_y2, qr_x1:qr_x2] = 1.0
    qr_mask = cv2.GaussianBlur(qr_mask, (feather * 2 + 1, feather * 2 + 1), 0)

    mirrored = cv2.flip(f, 1)
    for c in range(3):
        clean_f[:, :, c] = (clean_f[:, :, c] * (1.0 - qr_mask) + mirrored[:, :, c] * qr_mask).astype(np.uint8)

    # 2. Inpaint top-center attribution text
    text_region = clean_f[50:110, 400:680]
    bright_pixels = (text_region > 35).any(axis=2)
    if np.any(bright_pixels):
        text_mask = np.zeros((h, w), dtype=np.uint8)
        text_mask[50:110, 400:680][bright_pixels] = 255
        text_mask = cv2.dilate(text_mask, np.ones((5, 5), np.uint8), iterations=2)
        clean_f = cv2.inpaint(clean_f, text_mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)

    return clean_f

def build_animation(input_video_path, output_video_path, width=1080, height=1080, fps=30):
    cap = cv2.VideoCapture(input_video_path)
    if not cap.isOpened():
        raise IOError(f"Could not open input video: {input_video_path}")

    # Read first frame
    ret, first_frame = cap.read()
    if not ret or first_frame is None:
        raise ValueError("Could not read first frame from video.")

    first_frame_resized = cv2.resize(first_frame, (width, height), interpolation=cv2.INTER_AREA)
    blueprint_frame, bp_bg, line_layer = create_blueprint_sheet(first_frame_resized, width, height)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    # Phase 1: Scan reveal (~1.6 seconds = 48 frames)
    reveal_frames = int(1.6 * fps)
    for i in range(reveal_frames):
        t = i / float(reveal_frames)
        # Ease-out cubic
        progress = 1.0 - (1.0 - t) ** 3
        scan_x = int(progress * width)

        frame = blueprint_frame.copy()
        # Pixels past scan_x show only background grid
        if scan_x < width:
            frame[:, scan_x:] = bp_bg[:, scan_x:]
            # Glowing scan line
            scan_thickness = 4
            x1 = max(0, scan_x - scan_thickness)
            x2 = min(width, scan_x + scan_thickness)
            frame[:, x1:x2] = cv2.addWeighted(frame[:, x1:x2], 0.3, np.full_like(frame[:, x1:x2], (255, 230, 180)), 0.7, 0)

        out.write(frame)

    # Phase 2: Hold on complete blueprint (~0.9 seconds = 27 frames)
    hold_frames = int(0.9 * fps)
    for _ in range(hold_frames):
        out.write(blueprint_frame)

    # Phase 3: Morph / Crossfade into real video (~0.8 seconds = 24 frames)
    morph_frames = int(0.8 * fps)
    for i in range(morph_frames):
        alpha = i / float(morph_frames)
        ret, vframe = cap.read()
        if ret and vframe is not None:
            curr_vframe = clean_watermark(cv2.resize(vframe, (width, height)))
        else:
            curr_vframe = clean_watermark(first_frame_resized)

        blended = cv2.addWeighted(blueprint_frame, 1.0 - alpha, curr_vframe, alpha, 0)
        out.write(blended)

    # Phase 4: Remaining turntable rotation from original video
    while True:
        ret, vframe = cap.read()
        if not ret or vframe is None:
            break
        curr_vframe = clean_watermark(cv2.resize(vframe, (width, height)))
        out.write(curr_vframe)

    cap.release()
    out.release()
    print(f"Successfully generated clean animation: {output_video_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate blueprint-to-3D video animation.")
    parser.add_argument("--input", "-i", required=False, default="atc_blueprint_to_3d.mp4", help="Path to input video")
    parser.add_argument("--output", "-o", required=False, default="atc_blueprint_to_3d_generated.mp4", help="Path to output video")
    args = parser.parse_args()

    input_path = os.path.abspath(args.input)
    output_path = os.path.abspath(args.output)
    print(f"Processing input: {input_path}")
    print(f"Target output: {output_path}")
    build_animation(input_path, output_path)
