$(document).ready(() => {
  const $button = $("#upgrade_class_btn");

  const currentUrl = window.location.pathname;
  let adminStudentId = currentUrl.split("/")[3];
  let userStudentId = currentUrl.split("/")[4];
  let url = "";

  if (currentUrl === `/super-user/student/${adminStudentId}/`) {
    url = `/upgrade-class/${adminStudentId}/`;
  } else {
    url = `/upgrade-class/${userStudentId}/`;
  }

  $button.on("click", async () => {
    $button.prop("disabled", true);

    try {
      await $.ajax({
        method: "GET",
        url,
        success: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      window.location.reload();
    }
  });
});
