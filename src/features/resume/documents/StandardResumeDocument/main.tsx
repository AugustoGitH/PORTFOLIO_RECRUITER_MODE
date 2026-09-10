import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { ResumeProfile } from "../../data"

const styles = StyleSheet.create({
  page: { paddingTop: 46, paddingRight: 48, paddingBottom: 52, paddingLeft: 48, fontFamily: "Helvetica", fontSize: 9.5, color: "#172033", lineHeight: 1.45 },
  header: { borderBottomWidth: 1, borderBottomColor: "#6d28d9", paddingBottom: 12, marginBottom: 16 },
  name: { fontFamily: "Helvetica-Bold", fontSize: 21, color: "#111827", marginBottom: 3 },
  roles: { color: "#4b5563", fontSize: 10.5 },
  links: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 7 },
  link: { color: "#4c1d95", fontSize: 8.5 },
  section: { marginBottom: 13 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 11, color: "#111827", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 5 },
  paragraph: { marginBottom: 4 },
  experience: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: "#d1d5db" },
  experienceHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 2 },
  organization: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  period: { color: "#4b5563", fontSize: 8.5 },
  kind: { fontSize: 8.5, color: "#4b5563", marginBottom: 2 },
  technologies: { fontSize: 8.5, color: "#374151", marginTop: 3 },
  skillGroup: { marginBottom: 5 },
  skillGroupTitle: { fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, textAlign: "center", color: "#6b7280", fontSize: 8 },
})

export const StandardResumeDocument = ({ profile }: { profile: ResumeProfile }) => (
  <Document title={`${profile.name} — ${profile.roles[0]}`} author={profile.name} subject="Resume">
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.roles}>{profile.roles.join(" · ")}</Text>
        <View style={styles.links}>{profile.links.map((link) => <Text key={link.href} style={styles.link}>{link.label}: {link.href}</Text>)}</View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{profile.labels.summary}</Text>
        {profile.summary.map((paragraph) => <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{profile.labels.experience}</Text>
        {profile.experiences.map((experience) => (
          <View key={experience.organization} style={styles.experience} minPresenceAhead={70}>
            <View style={styles.experienceHeader}><Text style={styles.organization}>{experience.organization}</Text><Text style={styles.period}>{experience.period}</Text></View>
            <Text style={styles.kind}>{experience.kind}</Text>
            <Text>{experience.description}</Text>
            {experience.skills.length > 0 && <Text style={styles.technologies}>{profile.labels.technologies}: {experience.skills.join(", ")}</Text>}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{profile.labels.skills}</Text>
        {profile.skillGroups.map((group) => <Text key={group.title} style={styles.skillGroup}><Text style={styles.skillGroupTitle}>{group.title}: </Text>{group.skills.join(", ")}</Text>)}
      </View>

      <Text fixed style={styles.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </Page>
  </Document>
)
