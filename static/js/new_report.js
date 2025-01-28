import { openModalFunction } from "./extras/extras.js";
import { removeError, showError } from "./extras/input_errors.js";
import { errorMessage, toaster } from "./extras/toaster.js";

$(document).ready(() => {
  const $open = $("#report_modal_open");
  const $close = $("#report_modal_close");
  const $modal = $("#report_modal");
  const $button = $("#report_modal_save");
  const $form = $("#report_form");

  const $numeracyLevel = $("#numeracylevel");
  const $literacyLevel = $("#literacylevel");
  const $description = $("#description");

  $open.on("click", () => {
    openModalFunction($modal, $numeracyLevel);
  });

  function resetForm() {
    $form[0].reset();
    $modal.addClass("hidden");
    document.body.style.overflow = "";
  }

  $close.on("click", () => {
    resetForm();
  });

  const currentUrl = window.location.pathname;
  let adminStudentId = currentUrl.split("/")[3];
  let userStudentId = currentUrl.split("/")[4];
  let url = "";

  if (currentUrl === `/super-user/student/${adminStudentId}/`) {
    url = `/reports/${adminStudentId}/`;
  } else {
    url = `/reports/${userStudentId}/`;
  }
  $form.submit(async (e) => {
    e.preventDefault();

    if ($numeracyLevel.val().trim().length < 4) {
      showError("numeracylevel_container", "Please mention numeracy level");
      $numeracyLevel.focus();
      return;
    } else {
      removeError("numeracylevel_container");
    }
    if ($literacyLevel.val().trim().length < 4) {
      showError("literacylevel_container", "Please mention numeracy level");
      $literacyLevel.focus();
      return;
    } else {
      removeError("literacylevel_container");
    }

    $button.prop("disabled", true).text("Reporting ...");

    let formData = new FormData();
    formData.append("numeracylevel", $numeracyLevel.val().trim());
    formData.append("literacylevel", $literacyLevel.val().trim());
    formData.append("description", $description.val().trim());
    formData.append(
      "csrfmiddlewaretoken",
      $form.find("[name=csrfmiddlewaretoken]").val()
    );

    try {
      await $.ajax({
        method: "POST",
        data: formData,
        url,
        processData: false,
        contentType: false,
        success: async (report) => {
          if (report) {
            const $container = $("#report_data");
            const $noReport = $("#no_report");
            if ($noReport.length) {
              $noReport.remove();
              const card = `
<div id="report_data" class="grid md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-5">
     <div
    class="info px-2 py-3 rounded-lg relative [&_span]:ps-2 [&_p]:uppercase [&_span]:text-base [&_span]:text-stone-950 [&_span]:font-medium"
  >
    <div class="flex justify-between mb-4">
      <p>class <span>${report.class}</span></p>
      <p class="underline underline-offset-2 font-medium">
        ${report.created_at}
      </p>
    </div>

    <p>Numercy Level<span>${report.numeracylevel}</span></p>
    <p class="mb-2">Literacy Level<span>${report.literacylevel} </span></p>
    <p class="mb-3">
      Notes
      <span>${report.description} </span>
    </p>

    <p class="text-end">
      reviewed by<span class="underline underline-offset-2"
        >you</span
      >
    </p>
  </div>         
</div>

`;
              $("#main_container").append(card);
            
            
            } else {
              const card = `<div
    class="info px-2 py-3 rounded-lg relative [&_span]:ps-2 [&_p]:uppercase [&_span]:text-base [&_span]:text-stone-950 [&_span]:font-medium"
  >
    <div class="flex justify-between mb-4">
      <p>class <span>${report.class}</span></p>
      <p class="underline underline-offset-2 font-medium">
        ${report.created_at}
      </p>
    </div>

    <p>Numercy Level<span>${report.numeracylevel}</span></p>
    <p class="mb-2">Literacy Level<span>${report.literacylevel} </span></p>
    <p class="mb-3">
      Notes
      <span>${report.description} </span>
    </p>

    <p class="text-end">
      reviewed by<span class="underline underline-offset-2"
        >you</span
      >
    </p>
  </div>`;
              $container.prepend(card);
            }
          
        
        resetForm()
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

    $button.prop("disabled", false).text("Report");
  });
});
