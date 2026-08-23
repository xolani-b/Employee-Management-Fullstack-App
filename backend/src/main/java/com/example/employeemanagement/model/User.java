package com.example.employeemanagement.model;

import javax.persistence.*;

/** This class represents the user entity. */
@Entity
@Table(name = "users")
public class User {

  /** The user ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The username. */
  @Column(nullable = false, unique = true)
  private String username;

  /** The password. */
  @Column(nullable = false)
  private String password;

  /** Factory app role used by the frontend dashboards and future backend permissions. */
  @Column(nullable = false)
  private String role = "WORKER";

  /** Access status. Suspended users must not receive a usable dashboard. */
  @Column(nullable = false)
  private String status = "PENDING_APPROVAL";

  /**
   * The WebAuthn user handle: a stable, opaque, base64url-encoded identifier for this user that is
   * used by passkeys instead of the username. It is generated lazily the first time the user
   * registers a passkey and never changes for the lifetime of the account.
   */
  @Column(name = "user_handle", unique = true, length = 64)
  private String userHandle;

  // Getters and Setters

  /**
   * Gets the user ID.
   *
   * @return The user ID
   */
  public Long getId() {
    return id;
  }

  /**
   * Sets the user ID.
   *
   * @param id The user ID
   */
  public void setId(Long id) {
    this.id = id;
  }

  /**
   * Gets the username.
   *
   * @return The username
   */
  public String getUsername() {
    return username;
  }

  /**
   * Sets the username.
   *
   * @param username The username
   */
  public void setUsername(String username) {
    this.username = username;
  }

  /**
   * Gets the password.
   *
   * @return The password
   */
  public String getPassword() {
    return password;
  }

  /**
   * Sets the password.
   *
   * @param password The password
   */
  public void setPassword(String password) {
    this.password = password;
  }

  /**
   * Gets the user's role.
   *
   * @return the user's role
   */
  public String getRole() {
    return role;
  }

  /**
   * Sets the user's role.
   *
   * @param role the user's role
   */
  public void setRole(String role) {
    this.role = role;
  }

  /**
   * Gets the user's access status.
   *
   * @return the user's status
   */
  public String getStatus() {
    return status;
  }

  /**
   * Sets the user's access status.
   *
   * @param status the user's status
   */
  public void setStatus(String status) {
    this.status = status;
  }

  /**
   * Gets the WebAuthn user handle.
   *
   * @return The base64url-encoded user handle, or {@code null} if none has been assigned yet
   */
  public String getUserHandle() {
    return userHandle;
  }

  /**
   * Sets the WebAuthn user handle.
   *
   * @param userHandle The base64url-encoded user handle
   */
  public void setUserHandle(String userHandle) {
    this.userHandle = userHandle;
  }
}
