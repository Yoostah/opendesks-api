import { userData } from "../../scripts/session.js";
import { addPageOperations, propertyType } from "../../scripts/script.js";
import { fetchWorkspaces } from "../../scripts/api.js";
import { setLoaderVisibility } from "../../scripts/domBuilder.js";
import { baseUrl } from "../../scripts/config.js";

function addWorkspace(workspaceData, userSessionData) {
  const workspace = document.createElement("div");
  workspace.classList.add("workspace");

  const isTheOwner =
    userSessionData?.role == "owner" &&
    userSessionData?.userId == workspaceData.ownerId;

  const imageSrc = workspaceData.image.includes("http")
    ? workspaceData.image
    : `../../images/${workspaceData.image}`;

  workspace.innerHTML = `
                      <div class="workspace-container">
                        <h2 class="workspace-title">
                          ${workspaceData.name}
                          ${
                            isTheOwner
                              ? `<span class="manage" data-workspace-id="${workspaceData.id}">
                                  <img src="../../assets/setting.png" class="manage-icon" />
                                </span>`
                              : ""
                          }
                        </h2>
                        <img class="workspace-image" src="${imageSrc}" />
                        <div class="workspace-info">
                          <div class="info-container">
                            <label>Price:</label>
                            <span>
                              ${new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(workspaceData.price)}
                            </span>
                          </div>
                          <div class="info-container">
                            <label>Lease Term:</label>
                            <span>
                              ${
                                workspaceData.leaseTerm
                                  .charAt(0)
                                  .toUpperCase() +
                                workspaceData.leaseTerm.slice(1)
                              }
                            </span>
                          </div>
                          <div class="info-container">
                            <label>Availability Date:</label>
                            <span class="availability-date">
                              ${
                                /*new Date(
                                workspaceData.availabilityDate
                              ).toLocaleDateString("en-CA")*/
                                "Available Now"
                              }
                            </span>
                          </div>
                          <div class="info-container">
                            <label class="info-label">Smoking rule</label>
                            <div class="icons-container">
                              ${isSmokingAllowed(
                                workspaceData.isSmokingAllowed
                              )}
                            </div>
                          </div>
                          <div class="info-container">
                            <label class="info-label">Workspace Type</label>
                            <div class="icons-container">
                              ${propertyType(workspaceData.type, "../../")}
                            </div>
                          </div>
                        </div>
                      </div>`;

  if (!isTheOwner) {
    workspace.innerHTML += `
        <a href="${baseUrl}booking/?workspaceId=${workspaceData.id}" class="check-button">Book Now</a>
    `;
  }
  return workspace;
}

const isSmokingAllowed = (isSmokingAllowed) => {
  return isSmokingAllowed
    ? "<img src='../../assets/svg/smoking-allowed.svg' class='svg-icon'/>"
    : "<img src='../../assets/svg/smoking-not-allowed.svg' class='svg-icon'/>";
};

document.addEventListener("DOMContentLoaded", async function () {
  const workspaceSection = document.querySelector(".spaces-section");

  const params = new URLSearchParams(location.search);
  const propertyId = params.get("propertyId");

  addPageOperations(
    userData,
    "register-workspace/?propertyId=" + propertyId,
    "../.."
  );

  if (propertyId) {
    setLoaderVisibility(true);
    const spaces = await fetchWorkspaces(propertyId);

    const noContentSection = document.querySelector(".no-content-available");

    if (!spaces?.length) {
      noContentSection.innerHTML =
        "<p class='none-available'>There are not workspaces available for this property</p>";
      noContentSection.style.display = "grid";

      setLoaderVisibility(false);
      return;
    }

    noContentSection.style.display = "none";

    spaces.forEach((workspace) =>
      workspaceSection.append(addWorkspace(workspace, userData))
    );

    const manageIcons = document.querySelectorAll(".manage");

    manageIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const workspaceId = icon.dataset.workspaceId;
        window.location.assign(
          `${baseUrl}register-workspace/?workspaceId=${workspaceId}`
        );
      });
    });

    setLoaderVisibility(false);
  } else {
    console.log("Nenhuma propriedade selecionada");
  }
});
