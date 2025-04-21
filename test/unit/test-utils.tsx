import * as React from "react";
import { act, screen } from "@testing-library/react";

import Lightbox from "../../src/index.js";

function lightboxRoot() {
  return document.querySelector(".yarl__root");
}

export function lightbox(props?: Parameters<typeof Lightbox>[0]) {
  return <Lightbox open {...props} />;
}

export function querySelector(selector: string) {
  return lightboxRoot()?.querySelector(selector) ?? null;
}

export function findCurrentSlide() {
  return querySelector("div.yarl__slide_current");
}

export function findCurrentImage() {
  return findCurrentSlide()?.querySelector("img")?.src;
}

export function expectCurrentImageToBe(source: string) {
  expect(findCurrentImage()).toContain(source);
}

export function clickButton(name: string) {
  act(() => {
    screen.getByRole("button", { name }).click();
  });
}

export function queryButton(name: string) {
  return screen.queryByRole("button", { name });
}

export function expectToContainButton(name: string) {
  expect(queryButton(name)).toBeInTheDocument();
}

export function expectNotToContainButton(name: string) {
  expect(queryButton(name)).not.toBeInTheDocument();
}

export function expectLightboxToBeOpen() {
  expect(lightboxRoot()).toBeInTheDocument();
}

export function expectLightboxToBeClosed() {
  expect(lightboxRoot()).not.toBeInTheDocument();
}
