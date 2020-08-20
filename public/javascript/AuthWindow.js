const authWindow = (provider) => {
  const height = 600;
  const width = 500;
  const top = window.outerHeight / 2 - height / 2;
  const left = screen.width / 2 - width / 2;
  window.open(
    `/auth/${provider}`,
    provider,
    "resizable=" +
      false +
      ", width=" +
      width +
      ", height=" +
      height +
      ", top=" +
      top +
      ", left=" +
      left +
      ""
  );
};
