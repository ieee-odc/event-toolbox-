import React, { useState, useRef, useEffect } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { formatTime } from "../../../utils/helpers/FormatDateWithTime";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "./../../../utils/UserData";
import { addWorkshop, editWorkshop, resetWorkshopModal, toggleWorkshopModal, updateSelectedWorkshopField } from "../../../core/Features/Workshops";
import { initializeEvents } from "../../../core/Features/Events";
import { initializeSpaces } from "../../../core/Features/Spaces";
import { useParams } from "react-router-dom";
function WorkshopModal() {
  const { eventId } = useParams();
  const { selectedWorkshop, isModalOpen, isEdit } = useSelector((state) => state.workshopsStore);
  const { events } = useSelector((state) => state.eventsStore);
  const { spaces } = useSelector((state) => state.spacesStore);
  const dispatch = useDispatch();
  const userData = UserData();



  useEffect(() => {
    axiosRequest.get(`/space/get-event/${userData.id}`).then((res) => {
      dispatch(initializeSpaces(res.data.spaces))
    })
  }, [])

  useEffect(() => {
    axiosRequest.get(`/events/get-event/${userData.id}`).then((res) => {
      dispatch(initializeEvents(res.data.events))
    })
  }, [])

  const handleChangeStartTime = (e) => {
    let value = e.target.value;

    let isDelete = selectedWorkshop.startTime.length > value.length;
    if (isDelete) {
      dispatch(
        updateSelectedWorkshopField({
          id: "startTime",
          value: value,
        })
      );
      return;
    }

    if (value.length >= 6) {
      return;
    }
    if (value.length === 2) {
      value += ":";
    }

    // Handle hours
    if (value.length === 1) {
      if (value !== "0" && value !== "1" && value !== "2") {
        return;
      }
    } else if (value.length === 3) {
      const firstChar = value.charAt(0);
      if (firstChar === "2") {
        if (
          value.charAt(1) !== "0" &&
          value.charAt(1) !== "1" &&
          value.charAt(1) !== "2" &&
          value.charAt(1) !== "3"
        ) {
          return;
        }
      }
    }

    if (value.length === 4) {
      const minutesFirstChar = value.charAt(3);
      if (
        minutesFirstChar !== "0" &&
        minutesFirstChar !== "1" &&
        minutesFirstChar !== "2" &&
        minutesFirstChar !== "3" &&
        minutesFirstChar !== "4" &&
        minutesFirstChar !== "5"
      ) {
        return;
      }
    } else if (value.length === 5) {
      const minutesFirstChar = value.charAt(4);
      if (
        minutesFirstChar !== "0" &&
        minutesFirstChar !== "1" &&
        minutesFirstChar !== "2" &&
        minutesFirstChar !== "3" &&
        minutesFirstChar !== "4" &&
        minutesFirstChar !== "5" &&
        minutesFirstChar !== "6" &&
        minutesFirstChar !== "7" &&
        minutesFirstChar !== "8" &&
        minutesFirstChar !== "9"
      ) {
        return;
      }
    }
    dispatch(
      updateSelectedWorkshopField({
        id: "startTime",
        value: value,
      })
    );
  };

  const handleChangeEndTime = (e) => {
    let value = e.target.value;

    let isDelete = selectedWorkshop.endTime.length > value.length;
    if (isDelete) {
      dispatch(
        updateSelectedWorkshopField({
          id: "endTime",
          value: value,
        })
      );
      return;
    }

    if (value.length >= 6) {
      return;
    }
    if (value.length === 2) {
      value += ":";
    }

    // Handle hours
    if (value.length === 1) {
      if (value !== "0" && value !== "1" && value !== "2") {
        return;
      }
    } else if (value.length === 3) {
      const firstChar = value.charAt(0);
      if (firstChar === "2") {
        if (
          value.charAt(1) !== "0" &&
          value.charAt(1) !== "1" &&
          value.charAt(1) !== "2" &&
          value.charAt(1) !== "3"
        ) {
          return;
        }
      }
    }

    if (value.length === 4) {
      const minutesFirstChar = value.charAt(3);
      if (
        minutesFirstChar !== "0" &&
        minutesFirstChar !== "1" &&
        minutesFirstChar !== "2" &&
        minutesFirstChar !== "3" &&
        minutesFirstChar !== "4" &&
        minutesFirstChar !== "5"
      ) {
        return;
      }
    } else if (value.length === 5) {
      const minutesFirstChar = value.charAt(4);
      if (
        minutesFirstChar !== "0" &&
        minutesFirstChar !== "1" &&
        minutesFirstChar !== "2" &&
        minutesFirstChar !== "3" &&
        minutesFirstChar !== "4" &&
        minutesFirstChar !== "5" &&
        minutesFirstChar !== "6" &&
        minutesFirstChar !== "7" &&
        minutesFirstChar !== "8" &&
        minutesFirstChar !== "9"
      ) {
        return;
      }
    }
    dispatch(
      updateSelectedWorkshopField({
        id: "endTime",
        value: value,
      })
    );
  };

  const handleAddWorkshop = (workshop) => {
    // Combine date, startTime, and endTime into a single Date object
    const startDate = selectedWorkshop.date;
    const [hours, minutes] = selectedWorkshop.startTime.split(":");
    startDate.setHours(parseInt(hours, 10));
    startDate.setMinutes(parseInt(minutes, 10));

    const endDate = selectedWorkshop.date;
    const [endHours, endMinutes] = selectedWorkshop.endTime.split(":");
    endDate.setHours(parseInt(endHours, 10));
    endDate.setMinutes(parseInt(endMinutes, 10));

    const reqBody = {
      organizerId: userData.id,
      name: selectedWorkshop.name,
      description: selectedWorkshop.description,
      startTime: startDate.toISOString(), // Send as ISO string or in a format expected by your backend
      endTime: endDate.toISOString(), // Send as ISO string or in a format expected by your backend
      eventId: selectedWorkshop.eventId,
      spaceId: selectedWorkshop.spaceId,
    };

    console.log(reqBody)

    // Make the API request
    axiosRequest
      .post("/workshop/add", reqBody)
      .then((res) => {
        toast.success("Successfully created!");
        dispatch(toggleWorkshopModal())
        dispatch(addWorkshop({
          ...res.data.workshop,
          capacity: 50
        }))
      })
      .catch((err) => {
        console.log(err)
        toast.error("Failed to add workshop");
      });
  };

  const handleEditWorkshop = () => {
    const startDate = selectedWorkshop.date;
    const [hours, minutes] = selectedWorkshop.startTime.split(":");
    startDate.setHours(parseInt(hours, 10));
    startDate.setMinutes(parseInt(minutes, 10));

    const endDate = selectedWorkshop.date;
    const [endHours, endMinutes] = selectedWorkshop.endTime.split(":");
    endDate.setHours(parseInt(endHours, 10));
    endDate.setMinutes(parseInt(endMinutes, 10));

    // Create the request body
    const reqBody = {
      organizerId: userData.id,
      name: selectedWorkshop.name,
      description: selectedWorkshop.description,
      startTime: startDate.toISOString(), // Send as ISO string or in a format expected by your backend
      endTime: endDate.toISOString(), // Send as ISO string or in a format expected by your backend
      eventId: selectedWorkshop.eventId,
      spaceId: selectedWorkshop.spaceId,
    };

    console.log(reqBody)

    // Make the API request
    axiosRequest
      .post(`/workshop/edit/${selectedWorkshop.id}`, reqBody)
      .then((res) => {
        toast.success("Successfully Edited!");
        dispatch(toggleWorkshopModal())
        dispatch(editWorkshop({
          ...res.data.workshop,
          capacity: 50
        }))
      })
      .catch((err) => {
        toast.error("Failed to edit workshop");
      });
  };

  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(
      updateSelectedWorkshopField({ id: payload.id, value: payload.value })
    );
  };

  const handleDateChange = (date) => {
    dispatch(
      updateSelectedWorkshopField({ id: "date", value: date })
    );
  }

  return (
    isModalOpen && (
      <div
        className="modal fade show"
        id="modalCenter"
        tabIndex={-1}
        style={{ display: "block" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalCenterTitle">
                {isEdit ? "Edit" : "Add"} Workshop
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={()=>{
                  dispatch(toggleWorkshopModal())
                  if(isEdit){
                    dispatch(resetWorkshopModal())
                  }
                }}
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    value={selectedWorkshop.name}
                    onChange={handleInputChange}
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter Name"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="nameWithTitle" className="form-label">
                    Description
                  </label>
                  <div className="input-group input-group-merge form-send-message">
                    <textarea
                      value={selectedWorkshop.description}
                      onChange={handleInputChange}
                      className="form-control message-input"
                      placeholder="Enter Description"
                      id="description"
                      rows="2"
                    ></textarea>
                    <span className="message-actions input-group-text">
                      <i className="bx bx-bot cursor-pointer speech-to-text"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row mb-3 g-2">
                <div className="col mb-0">
                  <label htmlFor="emailWithTitle" className="form-label">
                    Space
                  </label>
                  <select
                    id="spaceId"
                    className="select2 form-select form-select-md select2-hidden-accessible"
                    data-allow-clear="true"
                    data-select2-id="select2Basic"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={selectedWorkshop.spaceId}
                    onChange={handleInputChange}
                  >
                    {
                      spaces.map((space, i) => {
                        return <option value={space.id} data-select2-id={space.id}>
                          {space.name}
                        </option>
                      })
                    }
                  </select>
                </div>
                <div className="col mb-0">
                  <label htmlFor="emailWithTitle" className="form-label">
                    Event
                  </label>
                  <select
                    id="eventId"
                    className="select2 form-select form-select-md select2-hidden-accessible"
                    data-allow-clear="true"
                    data-select2-id="select2Basic"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={selectedWorkshop.eventId}
                    onChange={handleInputChange}
                  >
                    {
                      events.map((event, index) => {
                        return <option value={event.id} data-select2-id={event.id}>
                          {event.name}
                        </option>
                      })
                    }
                  </select>
                </div>
              </div>
              <div className="row mb-3 g-2">
                <div className="col mb-0">
                  <label htmlFor="start-time" className="form-label">
                    Start Time
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="startTime"
                    placeholder="HH:MM"
                    value={selectedWorkshop.startTime}
                    onChange={handleChangeStartTime}
                  />
                </div>
                <div className="col mb-0">
                  <label htmlFor="end-time" className="form-label">
                    End Time
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="endTime"
                    placeholder="HH:MM"
                    value={selectedWorkshop.endTime}
                    onChange={handleChangeEndTime}
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="col mb-3"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label htmlFor="nameWithTitle" className="form-label">
                    Date
                  </label>
                  <DatePicker
                    selected={selectedWorkshop.date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    locale="en"
                    placeholderText="Choose a date"
                    minDate={new Date()}
                    type="date"
                    id="nameWithTitle"
                    className="form-control"
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-label-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  dispatch(toggleWorkshopModal())
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={isEdit ? handleEditWorkshop : handleAddWorkshop}
              >
                {isEdit ? "Save Changes" : "Create Workshop"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default WorkshopModal;
