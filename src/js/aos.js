import AOS from "@nitlix-hq/aos";

let destroyAOS = () => {};

export function initAOS() {
  destroyAOS();

  document.documentElement.classList.remove("aos-enabled");

  requestAnimationFrame(() => {
    document.documentElement.classList.add("aos-enabled");

    requestAnimationFrame(() => {
      const instance = AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        mirror: true,
        offsetEnter: 80,
        offsetExit: 0,
      });

      destroyAOS = instance.destroy;
    });
  });
}
