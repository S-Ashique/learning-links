import { addNewStudentData, changePicture } from "./extras/add_new_data.js";
import { openModalFunction, preventArrowKeys } from "./extras/extras.js";
import {
  class_name_validation,
  dob_validation,
  emis_validation,
  name_validation,
  year_validation,
} from "./extras/student_validation.js";
import { errorMessage, toaster } from "./extras/toaster.js";

$(document).ready(() => {
  const $open = $("#student_modal_open");
  const $close = $("#student_modal_close");
  const $modal = $("#student_modal");
  const $button = $("#student_modal_save");
  const $form = $("#student_form");
  const $selectPhoto = $("#student_photo");

  const $name = $("#name");
  const $emis = $("#emis");
  const $dob = $("#dob");
  const $gender = $("#gender");
  const $class_name = $("#class_name");
  const $year = $("#year");
  const $studentPicture = $("#student_picture");
  const $stdnt_updated_by = $("#student_updated_by");

  let defaultvalue = {
    name: $name.val(),
    emis: $emis.val(),
    dob: $dob.val(),
    gender: $gender.val(),
    studentPicture: $studentPicture[0].files[0],
    class_name: $class_name.val(),
    year: $year.val(),
  };

  let newStudent = $open.data("method") === "new" ? true : false;
  let update = $open.data("method") === "update" ? true : false;
  let studentId = String($open.data("student-id"));

  var currentUrl = window.location.pathname;
  let adminSchoolId = currentUrl.split("/")[3];
  let userSchoolId = currentUrl.split("/")[2];

  let changeText = "Updat";
  let url = "";
  let redirect_to = "";

  if (newStudent && currentUrl.startsWith("/super-user/school/")) {
    changeText = "Sav";
    url = `/super-user/school/${adminSchoolId}/students/`;
    redirect_to = "/super-user/student/";
  } else if (newStudent && currentUrl.startsWith("/school/")) {
    url = `/school/${userSchoolId}/students/`;
    changeText = "Sav";
    redirect_to = `/school/${userSchoolId}/student/`;
  } else if (
    update &&
    currentUrl === `/school/${userSchoolId}/student/${studentId}/`
  ) {
    url = `/school/${userSchoolId}/student/${studentId}/`;
  }
  else if (update && currentUrl === `/super-user/student/${studentId}/` && studentId===adminSchoolId) {
   url = `/super-user/student/${studentId}/`;
  }

  $open.on("click", () => {
    openModalFunction($modal, $name);
    if(!update){
    $year.val(new Date().getFullYear());}
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

  $selectPhoto.on("click", () => {
    $studentPicture.click();
  });

  $studentPicture.on("change", (e) => {
    changePicture(
      e,
      "#student_picture_container",
      $selectPhoto,
      "Student Picture",
      "Change Picture"
    );
  });

  $form.find("input[type='number']").on("keydown", preventArrowKeys);

  $name.on("input", () => {
    name_validation($name);
  });

  $emis.on("input", () => {
    emis_validation($emis);
  });

  $class_name.on("input", () => {
    class_name_validation($class_name);
  });

  $dob.on("input", () => {
    dob_validation($dob);
  });
  $year.on("input", () => {
    year_validation($year);
  });
  function checkForChanges() {
    return (
      defaultvalue.name.trim() !== $name.val().trim() ||
      defaultvalue.emis.trim() !== $emis.val().trim() ||
      defaultvalue.dob.trim() !== $dob.val().trim() ||
      defaultvalue.gender.trim() !== $gender.val().trim() ||
      defaultvalue.studentPicture !== $studentPicture[0].files[0] ||
      defaultvalue.class_name.trim() !== $class_name.val().trim() ||
      defaultvalue.year.trim() !== $year.val().trim()
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


    let isValid = true;

    if (!name_validation($name)) {
      isValid = isValid && false;
    }
    if (!emis_validation($emis)) {
      isValid = isValid && false;
    }

    if (!dob_validation($dob)) {
      isValid = isValid && false;
    }

    if (!class_name_validation($class_name)) {
      isValid = isValid && false;
    }

    if (!year_validation($year)) {
      isValid = isValid && false;
    }

    if (!isValid) return;

    let formData = new FormData();
    formData.append("name", $name.val().trim());
    formData.append("emis", $emis.val());
    formData.append("dob", $dob.val());
    formData.append("gender", $gender.val());
    formData.append("class_name", $class_name.val());
    formData.append("year", $year.val());
    formData.append("student_picture", $studentPicture[0].files[0]);
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
        success: async (student) => {
          if (student) {
            if (newStudent) {
              await addNewStudentData(
                student,
                $studentPicture[0].files[0],
                redirect_to
              );
              toaster("New student added successfully", "success");
              resetForm();
            } else if (update) {
              if (student.class_name==='12'){
                  window.location.reload()
                  return
              }
              
              
              toaster("Update successfull", "success");
              $("#student_name").text(student.name);
              $("#student_class").text(student.class_name);
              $("#student_year").text(`${$year.val()}-${Number($year.val())+1}`);
              $("#student_emis").text(student.emis);
              $("#student_gender").text(student.gender);
              $("#student_dob").text(student.dob);
              $("#crnt_class_btn").text(`${student.class_name} Std Reports`);

              if ($stdnt_updated_by.length === 0) {
                $("#stdnt_data").append(
                  ' <p>Updated by <span id="student_updated_by">You</span></p>'
                );
              } else {
                $stdnt_updated_by.text("you");
              }

              if ($studentPicture[0].files[0]) {
                const $noPhoto = $("#no_student_photo");
                if ($noPhoto.length) {
                  $noPhoto.remove();
                  $("#stdnt_picture_container").append(
                    `<img id="stdnt_photo" src=${URL.createObjectURL(
                      $studentPicture[0].files[0]
                    )} alt="school picture" class="size-full object-center object-cover" />`
                  );
                } else {
                  $("#stdnt_photo").attr(
                    "src",
                    URL.createObjectURL($studentPicture[0].files[0])
                  );
                }
              } else {
                if (student.gender === "Male") {
                  $("#no_student_photo").text("👦");
                } else {
                  $("#no_student_photo").text("👧");
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
      }
      errorMessage(error);
    }

    $close.prop("disabled", false);
    $button.prop("disabled", false).text(`${changeText}e`);
  });
});
