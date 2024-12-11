let isEditing = false; // Flag to track if the settings are being edited

/**
 * Initializes cloud setup by sending a command to the device.
 *
 * This function sends the "+++" command to start the cloud setup process.
 */
function cloud_setup() {
  sendTX("+++");
  CommandSent = "+++";
}

/**
 * Opens the modal for cloud setup and starts the refresh interval.
 *
 * This function displays the modal and the overlay, hides the operator MCC/MNC container,
 * and begins the refresh of the metrics.
 */
function openCloudModal() {
  document.getElementById("modal_setup").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
  document.getElementById("operator-mccmnc-container").classList.add("hidden");
  startRefresh();
}

/**
 * Closes the modal for cloud setup and stops the refresh interval.
 *
 * This function hides the modal and overlay, stops the refresh interval,
 * and sends a command to reset the host tunnel.
 */
function closeModal() {
  document.getElementById("modal_setup").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  stopRefresh();
  sendTX("host tunnel");
}

/**
 * Saves the updated settings and validates the input values.
 *
 * This function checks if the user input for various settings (e.g., modem radio mode,
 * node name, APN, report interval, etc.) is valid. If any values have changed,
 * the corresponding commands are sent to the device. A reboot may be required based on
 * certain changes.
 */
async function saveSettings() {
  const selectedRadioMode = document.getElementById("modemRadioMode").value;
  const nodeName = document.getElementById("nodeName").value;
  const reportInterval = document.getElementById("reportInterval").value;
  const apnstring = document.getElementById("modemAPN").value;
  let eDRX = document.getElementById("modemeDRX").value;
  const rebootDelay = document.getElementById("rebootDelay").value;
  const OperatorSelect = document.getElementById("modeOperatorSelect").value;
  const gnssInterval = document.getElementById("GNSSinterval").value;

  // Validate the report interval
  if (Number(reportInterval) < Number(report_interval_min) || Number(reportInterval) > Number(43200)) {
    alert(`Report interval must be between ${report_interval_min} and 43200 seconds.`);
    return;
  }

  // Validate the APN string length
  if (apnstring.length > 64) {
    alert("APN name must be less than 64 characters.");
    return;
  }

  // Validate GNSS interval
  if (Number(gnssInterval) && Number(gnssInterval) > 3600 && Number(gnssInterval) <= 0) {
    alert("GNSS interval should be less than 3600 seconds.");
    return;
  }

  // Validate reboot delay
  if (rebootDelay < 0 && rebootDelay >= 240) {
    alert("Reboot delay must be between 0 and 240 hours.");
    return;
  }

  // Construct previous settings object to check changes
  const previousSettings = {
    selectedRadioMode: prevSelectedRadioMode,
    nodeName: prevNodeName,
    reportInterval: prevReportInterval,
    apnstring: prevApnstring,
    eDRX: prevSelectedeDRX,
    rebootDelay: prevrebootDelay,
    OperatorSelect: prevOpSelect,
    gnssInterval: prevgnssInterval,
  };

  let rebootNeeded = false; // Flag to indicate if a reboot is needed
  const commandPromises = []; // Store promises for the commands to send

  // Check if modem radio mode has changed
  if (selectedRadioMode !== previousSettings.selectedRadioMode) {
    rebootNeeded = true; // Reboot required
    commandPromises.push(await sendTX(`modem mode ${selectedRadioMode}`));
  }

  // Check if node name has changed
  if (nodeName !== previousSettings.nodeName) {
    commandPromises.push(await sendTX(`node name ${nodeName}`));
  }

  // Check if report interval has changed
  if (Number(reportInterval) !== previousSettings.reportInterval) {
    commandPromises.push(await sendTX(`node report interval ${reportInterval}`));
  }

  // Check if APN string has changed
  if (apnstring !== previousSettings.apnstring) {
    rebootNeeded = true; // Reboot required
    commandPromises.push(await sendTX(`modem apn ${apnstring}`));
  }

  // Check if eDRX has changed
  if (eDRX !== previousSettings.eDRX) {
    commandPromises.push(await sendTX(`modem edrx ${eDRX}`));
  }

  // Check if reboot delay has changed
  if (Number(rebootDelay) !== previousSettings.rebootDelay) {
    commandPromises.push(await sendTX(`node reboot delay ${rebootDelay}`));
  }

  // Check if operator selection has changed
  if (OperatorSelect !== previousSettings.OperatorSelect) {
    commandPromises.push(await sendTX(`modem operator ${OperatorSelect}`));
  }

  // Check if GNSS interval has changed
  if (Number(gnssInterval) !== previousSettings.gnssInterval) {
    commandPromises.push(await sendTX(`gnss interval ${gnssInterval}`));
  }

  // Send all the commands
  await Promise.all(commandPromises);

  // Handle reboot if needed
  if (rebootNeeded) {
    if (confirm("Changes require a reboot. Do you want to reboot now?")) {
      reboot_flag = 1;
      await sendTX("reboot");
      CommandSent = "reboot";
      stopRefresh();
      showLoadingScreen();
      rebootTimeout = setTimeout(() => {
        reboot_flag = 0;
        hideLoadingScreen_fail();
      }, 100000); // Reboot timeout
    } else {
      alert("Settings will take effect after the next reboot.");
    }
  }
  CommandSent = "update";
}

/**
 * Sends a command to disable sleep mode.
 *
 * This function disables the sleep mode of the device and updates the CommandSent flag.
 */
function refresh_metrics() {
  sendTX("sleep disable");
  CommandSent = "sleep disable";
}

/**
 * Starts refreshing metrics at regular intervals.
 *
 * This function starts an interval to refresh the metrics every 5 seconds.
 */
function startRefresh() {
  intervalId = setInterval(refresh_metrics, 5000); // Start refreshing every 5 seconds
}

/**
 * Stops refreshing metrics.
 *
 * This function stops the interval that was previously started for refreshing metrics.
 */
function stopRefresh() {
  clearInterval(intervalId); // Stop the interval using the stored ID
}

/**
 * Displays host report.
 *
 * This function sends a command to show the host report and updates the CommandSent flag.
 */
function hostshow() {
  sendTX("host report show");
  CommandSent = "host report show";
}

/**
 * Toggles the edit mode for settings.
 *
 * This function enables or disables the editing mode for various input fields in the UI.
 * When editing is enabled, the inputs are made editable, and the refresh is stopped.
 * When editing is disabled, the inputs are made readonly, and the refresh is started again.
 */
function edit_metrics() {
  const editButton = document.querySelector(".edit-btn");
  const inputsToToggle = [
    document.getElementById("modeOperatorSelect"),
    document.getElementById("modemAPN"),
    document.getElementById("nodeName"),
    document.getElementById("reportInterval"),
    document.getElementById("rebootDelay"),
    document.getElementById("GNSSinterval"),
  ];

  const selectsToToggle = [document.getElementById("modemRadioMode"), document.getElementById("modemeDRX")];

  if (isEditing) {
    startRefresh(); // Resume refreshing
    isEditing = false;
    editButton.style.backgroundColor = "#f37021"; // Set default color

    // Make all text inputs readonly
    inputsToToggle.forEach((input) => input.setAttribute("readonly", true));

    // Disable select elements
    selectsToToggle.forEach((select) => select.setAttribute("disabled", true));
  } else {
    stopRefresh(); // Stop refreshing
    isEditing = true;
    editButton.style.backgroundColor = "#33B34A"; // Set editing color

    // Make all text inputs editable
    inputsToToggle.forEach((input) => input.removeAttribute("readonly"));

    // Enable select elements
    selectsToToggle.forEach((select) => select.removeAttribute("disabled"));
  }
}

// function tlssetup() {
//   // for non-tls connections, the following
//   // needs to be sent in a sequence :
//   //
//   // -> mqtt hostname mosquitto.signal-fire.cloud
//   // <- MQTT Broker Hostname: mosquitto.signal-fire.cloud
//   // -> mqtt port 1883
//   // <- MQTT Broker Port: 1883
//   // -> mqtt username pulsar
//   // <- MQTT Username: pulsar
//   // -> mqtt password signalfire
//   // <- MQTT Password: **********
//   // -> mqtt tls level 0
//   // <- MQTT TLS Level: 0 - Disabled
//   // -> mqtt connect
//   sendTX("mqtt hostname mosquitto.signal-fire.cloud");
//   CommandSent = "mqtt hostname";
//   if (hexToAscii(receiveBufferHex).includes("MQTT Broker Hostname:")) {
//     let afterColon = hexToAscii(receiveBufferHex).split(": ")[1];
//     if (afterColon == "mosquitto.signal-fire.cloud") {
//       sendTX("mqtt port 1883");
//       CommandSent = "mqtt port";
//     } else {
//       sendTX("mqtt hostname mosquitto.signal-fire.cloud");
//       CommandSent = "mqtt hostname";
//     }
//   }
//   if (hexToAscii(receiveBufferHex).includes("MQTT Broker Port:")) {
//     // does it do number or does it do string here? what comp
//     let afterColon = hexToAscii(receiveBufferHex).split(": ")[1];
//     if (afterColon == "mosquitto.signal-fire.cloud") {
//       sendTX("mqtt port 1883");
//       CommandSent = "mqtt port";
//     } else {
//       sendTX("mqtt hostname mosquitto.signal-fire.cloud");
//       CommandSent = "mqtt hostname";
//     }
//     sendTX("mqtt username pulsar");
//   }
//   if (hexToAscii(receiveBufferHex).includes("MQTT Username:")) {
//     sendTX("mqtt password" + mqtt_password);
//   }
//   if (hexToAscii(receiveBufferHex).includes("MQTT Password:")) {
//     sendTX("mqtt tls level 0");
//   }
//   if (hexToAscii(receiveBufferHex).includes("MQTT TLS Level:")) {
//     sendTX("mqtt connect");
//   }
// }
