
import Swal from "sweetalert2";
import "./notifications.css";

export const confirmDelete = async (productName = "this product") => {
    return Swal.fire({
        title: "Delete Product",
        html: `
            <div class="delete-alert-message">
                Are you sure you want to delete ${productName}?
                <br />
                This action cannot be undone.
            </div>
        `,
        iconHtml: `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
            </svg>
        `,
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
        buttonsStyling: false,
        width: 390,
        padding: "24px",
        customClass: {
            popup: "delete-alert-popup",
            icon: "delete-alert-icon",
            title: "delete-alert-title",
            htmlContainer: "delete-alert-content",
            actions: "delete-alert-actions",
            confirmButton: "delete-alert-confirm",
            cancelButton: "delete-alert-cancel",
        },
    });
};
