import { useEffect, useState } from "react";
import {
  FaCapsules,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaShoppingBag,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import { updateCustomerProfile } from "../../services/api";
import { getUser, saveAuthSession } from "../../utils/auth";

import "./Profile.css";

export default function Profile() {
  const currentUser = getUser();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updatedUser = await updateCustomerProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      });

      saveAuthSession({
        role: "customer",
        user: updatedUser,
      });

      setProfile(updatedUser);

      alert("Profile Updated Successfully");

      setEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };
    return (
    <div className="profile-page page-shell">
      <section className="panel profile-page__hero">
        <div className="page-title">
          <span className="eyebrow">Account Settings</span>
          <h1>My Profile</h1>
          <p>Manage your personal information.</p>
        </div>
      </section>

      <div className="profile-card">
        <aside className="profile-left">
          <div className="avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>{profile.name}</h2>

          <p>{profile.email}</p>

          <div className="profile-stats">
            <div className="stat">
              <FaShoppingBag />
              <h3>Orders</h3>
              <span>Customer</span>
            </div>

            <div className="stat">
              <FaCapsules />
              <h3>Member</h3>
              <span>2026</span>
            </div>
          </div>
        </aside>

        <div className="profile-right">

          <div className="input-group">
            <label>
              <FaUser /> Full Name
            </label>

            <input
              name="name"
              value={profile.name}
              disabled
            />
          </div>

          <div className="input-group">
            <label>
              <FaEnvelope /> Email
            </label>

            <input
              name="email"
              value={profile.email}
              disabled
            />
          </div>

          <div className="input-group">
            <label>
              <FaPhone /> Phone
            </label>

            <input
              name="phone"
              value={profile.phone}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>
              <FaMapMarkerAlt /> Address
            </label>

            <textarea
              rows="5"
              name="address"
              value={profile.address}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">

            {!editing ? (

              <button
                className="edit-btn"
                onClick={() => setEditing(true)}
              >
                <FaEdit />

                Edit Profile

              </button>

            ) : (

              <>

                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {

                    setEditing(false);

                    setProfile({
                      name:
                        currentUser.name || "",
                      email:
                        currentUser.email || "",
                      phone:
                        currentUser.phone || "",
                      address:
                        currentUser.address || "",
                    });

                  }}
                >
                  <FaTimes />

                  Cancel

                </button>

              </>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}