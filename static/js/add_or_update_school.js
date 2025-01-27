import { addNewSchoolData, changePicture } from "./extras/add_new_data.js";
import { openModalFunction } from "./extras/extras.js";
import { removeError, showError } from "./extras/input_errors.js";
import { errorMessage, toaster } from "./extras/toaster.js";

$(document).ready(() => {
  const $open = $("#school_modal_open");
  const $close = $("#school_modal_close");
  const $modal = $("#school_modal");
  const $button = $("#school_modal_save");
  const $form = $("#school_form");

  const $selectPhoto = $("#select_photo");

  const $name = $("#name");
  const $state = $("#state");
  const $district = $("#district");
  const $place = $("#place");
  const $schoolPicture = $("#school_picture");
  const $description = $("#description");

  let defaultvalue = {
    name: $name.val(),
    state: $state.val(),
    district: $district.val(),
    place: $place.val(),
    school_picture: $schoolPicture[0].files[0],
    description: $description.val(),
  };

  let newSchool = $open.data("method") === "new" ? true : false;
  let update = $open.data("method") === "update" ? true : false;
  let schoolId = String($open.data("school-id"));

  const currentUrl = window.location.pathname;
  let adminSchoolId = currentUrl.split("/")[3];
  let userSchoolId = currentUrl.split("/")[2];

  let changeText = "Updat";
  let url = "";

  if (newSchool && currentUrl === "/super-user/schools/") {
    changeText = "Sav";
    url = "/super-user/schools/";
  } else if (
    update &&
    currentUrl.startsWith("/super-user/school/") &&
    adminSchoolId === schoolId
  ) {
    url = `/super-user/school/${schoolId}/`;
  } else if (update && userSchoolId === schoolId) {
    url = `/school/${userSchoolId}/`;
  }

  $open.on("click", () => {
    openModalFunction($modal, $name);
  });

  function resetForm() {
    $form[0].reset();
    $("#school_picture_container").find("img").remove();
    $("#school_picture_container").find("#remove_picture").remove();
    $selectPhoto.find("span").text("School Picture");
    $modal.addClass("hidden");
    document.body.style.overflow = "";
  }

  $close.on("click", () => {
    resetForm();
  });

  $name.on("input", (e) => {
    if (e.target.value.trim().length < 4) {
      showError("name_container", "Please enter a school name");
    } else {
      removeError("name_container");
    }
  });
  $selectPhoto.on("click", () => {
    $schoolPicture.click();
  });

  $schoolPicture.on("change", (e) => {
    changePicture(
      e,
      "#school_picture_container",
      $selectPhoto,
      "School Picture",
      "Change Picture"
    );
  });
  function checkForChanges() {
    return (
      defaultvalue.name.trim() !== $name.val().trim() ||
      defaultvalue.state.trim() !== $state.val().trim() ||
      defaultvalue.district.trim() !== $district.val().trim() ||
      defaultvalue.place.trim() !== $place.val().trim() ||
      defaultvalue.school_picture !== $schoolPicture[0].files[0] ||
      defaultvalue.description.trim() !== $description.val().trim()
    );
  }

  $form.submit(async (e) => {
    e.preventDefault();
    if (!url) {
      window.location.reload();
    }

    if (!checkForChanges()) {
      toaster("You didn't made any changes", "info");
      return;
    }

    if ($name.val().trim().length < 4) {
      showError("name_container", "Please enter a school name");
      $name.focus();
      return;
    } else {
      removeError("name_container");
    }

    let formData = new FormData();
    formData.append("name", $name.val().trim());
    formData.append("state", $state.val().trim());
    formData.append("district", $district.val().trim());
    formData.append("place", $place.val().trim());
    formData.append("school_picture", $schoolPicture[0].files[0]);
    formData.append("description", $description.val().trim());
    formData.append(
      "csrfmiddlewaretoken",
      $form.find("[name=csrfmiddlewaretoken]").val()
    );

    $close.prop("disabled", true);
    $button.prop("disabled", true).text(`${changeText}ing...`);

    try {
      await $.ajax({
        method: "POST",
        data: formData,
        url,
        processData: false,
        contentType: false,
        success: async ({ school }) => {
          if (school) {
            if (newSchool) {
              await addNewSchoolData(school, $schoolPicture[0].files[0]);
              resetForm();
            } else if (update) {
              toaster("Update successfull", "success");
              $("#school_name").text(school.name);
              $("#school_location").text(school.place);
              $("#school_description").text(school.description);
              $("#school_updated_at").text("Now");
              $("#school_updated_by").text("You");

              if ($schoolPicture[0].files[0]) {
                const $noPhoto = $("#no_school_photo");
                if ($noPhoto.length) {
                  $noPhoto.remove();
                  $("#school_data").append(
                    `<img id="school_photo" src=${URL.createObjectURL(
                      $schoolPicture[0].files[0]
                    )} alt="school picture" class="size-full object-center object-cover" />`
                  );
                } else {
                  $("#school_photo").attr(
                    "src",
                    URL.createObjectURL($schoolPicture[0].files[0])
                  );
                }
              }
            } else {
              window.location.reload();
            }
            $modal.addClass("hidden");
            document.body.style.overflow = "";
          } else {
            window.location.reload();
          }
        },
      });
    } catch (error) {
      if (error.status === 404) {
        window.location.reload();
      } else {
        errorMessage(error);
      }
    }

    $close.prop("disabled", false);
    $button.prop("disabled", false).text(`${changeText}e`);
  });
});
