import styles from './EnquiryBanner.module.css'

// Page-specific copy stays with its page; the shared banner has no image slot.
export default function EnquiryBanner({ children }) {
  return <section className={styles.banner} data-enquiry-banner>{children}</section>
}
