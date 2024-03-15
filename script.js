const hasParkingGarage = hasParkingGarage => {
    return hasParkingGarage
        ? "<img src='./assets/svg/parking.svg' class='svg-icon'/>"
        : ''
}

const hasPublicTransport = hasPublicTransportNearBy => {
    return hasPublicTransportNearBy
        ? "<img src='./assets/svg/bus.svg' class='svg-icon'/>"
        : ''
}

const isSmokingAllowed = isSmokingAllowed => {
    return isSmokingAllowed
        ? "<img src='./assets/svg/smoking-allowed.svg' class='svg-icon'/>"
        : "<img src='./assets/svg/smoking-not-allowed.svg' class='svg-icon'/>"
}

const propertyType = propertyType => {
    const mappedPropertyType = {
        meeting_room:
            "<img src='./assets/svg/meeting-room.svg' class='svg-icon'/>",
        private_office:
            "<img src='./assets/svg/private-room.svg' class='svg-icon'/>",
        desk: "<img src='./assets/svg/shared-space-desk.svg' class='svg-icon'/>"
    }

    return mappedPropertyType[propertyType] || ''
}

function addProperty(propertyData) {
    const property = document.createElement('div')
    property.classList.add('workspace')

    property.innerHTML = `
                    <div class="workspace-container">
                      <h2 class="workspace-title">${
                          propertyData.buildingName
                      }</h2>
                      <img class="workspace-image" src="images/${
                          propertyData.image
                      }" />
                      <div class="workspace-info">
                        <div class="info-container">
                          <label>Address:</label>
                          <span>${propertyData.address}</span>
                        </div>
                        <div class="info-container">
                          <label>Neighborhood:</label>
                          <span>${propertyData.neighborhood}</span>
                        </div>
                        <div class="info-container">
                          <label>Square Feet:</label>
                          <span>${propertyData.squareFeet}</span>
                        </div>
                        <div class="info-container">
                          <label class="info-label">Facilities</label>
                          <div class="facilities-container">
                            <div class="icons-container">
                            ${hasParkingGarage(propertyData.hasParkingGarage)}
                            ${hasPublicTransport(
                                propertyData.hasPublicTransportNearBy
                            )}
                            </div>
                          </div>
                        </div>
                        <div class="info-container">
                          <label class="info-label">Available Workspaces</label>
                          <div class="icons-container">
                            ${propertyData.workspaceTypes
                                .map(propertyType)
                                .join('')}
                          </div>    
                        </div>
                      </div>
                    </div>
                    <a href="./workspaces.html?propertyId=${
                        propertyData.id
                    }" class="check-button">View Details</a>
                `
    return property
}

function addWorkspace(workspaceData) {
    const workspace = document.createElement('div')
    workspace.classList.add('workspace')

    workspace.innerHTML = `
                      <div class="workspace-container">
                        <h2 class="workspace-title">${workspaceData.name}</h2>
                        <img class="workspace-image" src="images/${
                            workspaceData.image
                        }" />
                        <div class="workspace-info">
                          <div class="info-container">
                            <label>Price:</label>
                            <span>
                              ${new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
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
                            <label>Availability Date</label>
                            <span>
                              ${new Date(
                                  workspaceData.availabilityDate
                              ).toLocaleDateString('en-CA')}
                            </span>
                          </div>
                          <div class="info-container">
                            <div class="icons-container">
                              ${isSmokingAllowed(
                                  workspaceData.smokingIsAllowed
                              )}
                            </div>
                          </div>
                          <div class="info-container">
                            <label class="info-label">Workspace Type</label>
                            <div class="icons-container">
                              ${propertyType(workspaceData.type)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <a href="./booking.html?workspaceId=${
                          workspaceData.id
                      }" class="check-button">Book Now</a>
                `
    return workspace
}

async function fetchProperties(ownerId) {
    console.log(ownerId)
    let url = ownerId
        ? `http://localhost:3000/properties?ownerId=${ownerId}`
        : `http://localhost:3000/properties`

    const response = await fetch(url)

    const data = await response.json()
    return data
}

async function createProperty(propertyData) {
    const response = await fetch('http://localhost:3000/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

async function createUser(userData) {
    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data
}

async function fetchWorkspaces(propertyId) {
    try {
        const response = await fetch(
            `http://localhost:3000/workspaces/${propertyId}`
        )

        if (!response.ok) {
            throw new Error('Workspaces not found')
        }

        const data = await response.json()

        return data
    } catch (error) {
        return {}
    }
}

async function loginUser(loginData) {
    //This URL MUST be replaced when requesting data from the API

    try {
        const response = await fetch(
            `http://localhost:3000/users?email=${loginData.email}&password=${loginData.password}`
        )

        const userData = await response.json()

        if (userData.length) {
            sessionStorage.setItem(
                'open-desks@user',
                JSON.stringify({
                    name: userData[0].name,
                    role: userData[0].role,
                    userId: userData[0].id
                })
            )
            window.location.assign('http://127.0.0.1:5500/')
            return
        }

        throw new Error('User not Found')
    } catch (error) {
        console.log(error)
    }

    // [] quando o usuario nao existe
    // [{ dados usuario }]
}

const uploadImageBtn = document.querySelector('.upload-btn-image')
const uploadFileInput = document.querySelector('#upload-image-input')
if (uploadImageBtn) {
    uploadImageBtn.addEventListener('click', function () {
        uploadFileInput.click()
    })
}

if (uploadFileInput) {
    uploadFileInput.addEventListener('change', function () {
        document.querySelector('#uploaded-file-name').textContent =
            this.files[0]?.name || 'Select an Image for the Property'
    })
}

document.addEventListener('DOMContentLoaded', async function () {
    /* User Session Handler */
    const userSession = sessionStorage.getItem('open-desks@user')

    let userData

    if (userSession !== null) {
        userData = JSON.parse(userSession)

        if (['/login.html', '/booking.html'].includes(location.pathname)) {
            window.location.assign('http://127.0.0.1:5500/')
            return
        }
    }

    // ROUTES
    if (['/index.html', '/'].includes(location.pathname)) {
        const workspaceSection = document.querySelector('.workspaces-section')

        const properties = await fetchProperties(userData?.userId)

        for (let index = 0; index < properties.length; index++) {
            workspaceSection.append(addProperty(properties[index]))
        }
    }

    if (location.pathname == '/workspaces.html') {
        const workspaceSection = document.querySelector('.workspaces-section')

        const params = new URLSearchParams(location.search)
        const propertyId = params.get('propertyId')
        console.log(propertyId)

        if (propertyId) {
            const { spaces } = await fetchWorkspaces(propertyId)

            if (!spaces?.length) {
                workspaceSection.innerHTML =
                    '<p>There are no workspaces available for this property</p>'
                return
            }

            spaces.forEach(workspace =>
                workspaceSection.append(addWorkspace(workspace))
            )
        } else {
            console.log('Nenhuma propriedade selecionada')
        }
    }

    if (location.pathname == '/register.html') {
        const userRegistrationForm = document.getElementById(
            'user-registration-form'
        )

        userRegistrationForm.addEventListener('submit', async function (event) {
            event.preventDefault()

            const formData = Object.fromEntries(new FormData(event.target))

            await createUser(formData)
        })
    }

    if (location.pathname == '/register-property.html') {
        const propertyRegistrationForm = document.getElementById(
            'property-registration-form'
        )

        propertyRegistrationForm.addEventListener(
            'submit',
            async function (event) {
                event.preventDefault()

                const formData = Object.fromEntries(new FormData(event.target))
                const selectedPropertyTypes = [
                    ...document.querySelectorAll(
                        'input[name=workspaceTypes]:checked'
                    )
                ]

                // console.log(formData)
                const newProperty = {
                    ...formData,
                    hasParkingGarage: Boolean(
                        Number(formData.hasParkingGarage)
                    ),
                    hasPublicTransportNearBy: Boolean(
                        Number(formData.hasPublicTransportNearBy)
                    ),
                    image: formData.image.name,
                    workspaceTypes: selectedPropertyTypes.map(btn => btn.value)
                }

                await createProperty(newProperty)
                window.location.assign('http://127.0.0.1:5500/')
            }
        )
    }

    if (location.pathname == '/login.html') {
        const loginForm = document.getElementById('login-form')

        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault()

            const formData = Object.fromEntries(new FormData(event.target))

            await loginUser(formData)
        })
    }
})
