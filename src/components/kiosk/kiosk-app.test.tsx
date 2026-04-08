import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { KioskApp } from "@/components/kiosk/kiosk-app";

test("KioskApp renders the Yakitei start screen heading", () => {
  const html = renderToStaticMarkup(<KioskApp />);

  assert.match(html, /야키테이/);
  assert.match(html, /매장 식사/);
  assert.match(html, /포장/);
});
