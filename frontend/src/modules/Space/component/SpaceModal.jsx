import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRequest from '../../../utils/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { addSpace, deleteSpace, editSpace, resetSpaceModal, toggleSpaceModal, updateSelectedSpaceField } from '../../../core/Features/Spaces';
import toast from 'react-hot-toast';
import { UserData } from '../../../utils/UserData';

function SpaceModal() {
  const dispatch = useDispatch();

  const { isModalOpen, selectedSpace, isEdit } = useSelector((store) => store.spacesStore)

  const modalClassName = isModalOpen ? "modal fade show" : "modal fade";
  const userData = UserData();

  const handleDelete = async () => {
    try {
      axiosRequest.delete(`/space/delete/${selectedSpace.id}`).then((res) => {
        dispatch(deleteSpace(selectedSpace.id))
        dispatch(toggleSpaceModal())
        toast.success("Space deleted successfully");
      });

    } catch (error) {

    }
  };

  const handleInputChange = (e) => {
    const payload = e.target;
    dispatch(
      updateSelectedSpaceField({ id: payload.id, value: payload.value })
    );
  };

  const handleCreateSpace = () => {
    axiosRequest.post("/space/add", {
      ...selectedSpace,
      organizerId: userData.id
    }).then((res) => {
      dispatch(toggleSpaceModal())
      dispatch(resetSpaceModal())
      dispatch(addSpace(res.data.space))
      toast.success("Space added successfully");

    })
  }

  const handleEditSpace = () => {
    axiosRequest.post(`/space/edit/${selectedSpace.id}`, {
      ...selectedSpace,
      organizerId: userData.id
    }).then((res) => {
      dispatch(editSpace(res.data.space))
      dispatch(toggleSpaceModal())
      dispatch(resetSpaceModal())
      console.log(res.data)
      toast.success("Space edited successfully");

    })
  }

  return (
    <>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
      <div className={modalClassName} id="spaceModal" tabIndex="-1" style={{ display: isModalOpen ? "block" : "none", zIndex: 99999 }} aria-modal="true" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? 'Update Space' : 'Create Space'}</h5>
              <button type="button" className="btn-close" onClick={() => {
                dispatch(toggleSpaceModal())
                dispatch(resetSpaceModal())
              }} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="spaceName" className="form-label">Space Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter Space Name"
                  value={selectedSpace.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="spaceCapacity" className="form-label">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  className="form-control"
                  placeholder="Enter Capacity"
                  value={selectedSpace.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-label-secondary" onClick={() => {
                dispatch(toggleSpaceModal())
                dispatch(resetSpaceModal())
              }}>Close</button>
              <button className="btn btn-primary" onClick={isEdit ? handleEditSpace : handleCreateSpace}>
                {isEdit ? 'Save Changes' : 'Create'}
              </button>
              {selectedSpace.id && (
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpaceModal;
