import React from "react";
import {
  findByLabelText,
  findByTestId,
  fireEvent,
  getByAltText,
  getByTestId,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  //? Arrange

  render(<İletişimFormu />);

  //? Act

  const IletisimFormu = screen.getByText(/gönder/i);

  //? Assert

  expect(İletişimFormu).toBeInTheDocument();
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);

  const title = screen.getByTestId("header");

  expect(title).toBeTruthy();

  expect(title).toHaveTextContent(/İletişim Formu/i);
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<İletişimFormu />);

  const isim = await screen.findByTestId("name");
  fireEvent.change(isim, {
    target: { value: "ce" },
  });
  await waitFor(() => {
    expect(isim.value).toBe("ce");
  });

  expect(screen.getByTestId("error")).toHaveTextContent(
    /Hata : Ad en az 5 karakterli olmalıdır./i
  );
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<İletişimFormu />);

  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);

  expect(
    screen.getAllByText(
      /Hata : Soyad gereklidir./i,
      /Hata : Email geçerli bir email adresi olmalıdır./i
    )
  );
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<İletişimFormu />);

  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Oğuzhan");

  const soyad = await screen.findByTestId("surname");
  userEvent.type(soyad, "Alper");

  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  expect(screen.getByText(/Hata: Email geçerli bir email adresi olmalıdır./i));
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<İletişimFormu />);

  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "oguzhanalper@gmail.com");

  expect(screen.getByText(/Hata : Email geçerli bir email adresi olmalıdır./i));
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<İletişimFormu />);

  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Oğuzhan");
  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "oguzhanalper@gmail.com");

  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);
  expect(screen.getByText(/Hata: soyad gereklidir./i));
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<İletişimFormu />);

  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Oğuzhan");
  const soyad = await screen.findByTestId("surname");
  userEvent.type(soyad, "Alper");

  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "oguzhanalper@gmail.com");
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);

  const hata = screen.queryByTestId("error");
  expect(hata).not.toBeInTheDocument();
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const isim = await screen.findByTestId("name");
  userEvent.type(isim, "Oğuzhan");
  const soyad = await screen.findByTestId("surname");
  userEvent.type(soyad, "Alper");
  const email = await screen.findByTestId("emailDegeri");
  userEvent.type(email, "oguzhanalper@gmail.com");
  const clickButton = await screen.findByTestId("button");
  fireEvent.click(clickButton);

  const displayer = screen.getByTestId("gönderilen");
  expect(displayer).toBeInTheDocument();
});
