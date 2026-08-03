# ร้านจงชงดี — แอปบัญชี (PWA)

เว็บแอปบันทึกรายรับ-รายจ่าย เงินหมุน (หนี้เจ้าของ) และกำไร สำหรับร้านจงชงดี
ทำงานเป็น PWA ติดตั้งได้ทั้งมือถือและคอม ใช้ออฟไลน์ได้

## ไฟล์ในโปรเจกต์
- `index.html` — ตัวแอปทั้งหมด (UI + ตรรกะ + เก็บข้อมูลใน localStorage)
- `manifest.webmanifest` — ข้อมูลแอปสำหรับติดตั้ง
- `sw.js` — service worker (network-first + อัปเดตอัตโนมัติ)
- `icon-192.png`, `icon-512.png` — ไอคอนแอป

## การ deploy (GitHub Pages)
push ขึ้น branch `main` → เปิด Settings → Pages → Deploy from a branch → `main` / root
ลิงก์: `https://<username>.github.io/<repo>/`

## การออกเวอร์ชันใหม่ (สำคัญ)
ทุกครั้งที่แก้แล้วจะ deploy:
1. เปลี่ยนเลข `VERSION` ใน `sw.js` (เช่น `1.0.0` → `1.0.1`)
2. เปลี่ยนเลขใน `index.html` ที่ `<span id="appVer">` ให้ตรงกัน
3. commit + push

ผู้ใช้ที่ติดตั้งไว้จะได้เวอร์ชันใหม่อัตโนมัติเมื่อเปิดแอปครั้งถัดไป (network-first)

## หมายเหตุ
ข้อมูลเก็บในเครื่องผู้ใช้แต่ละคน (localStorage) ไม่ซิงก์ข้ามเครื่อง
สำรอง/ย้ายด้วยปุ่ม Export CSV ในแอป
