import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { ResumeProfile } from "../../data"
import "../fonts"

const styles = StyleSheet.create({
  page: { paddingTop: 42, paddingRight: 79, paddingBottom: 38, paddingLeft: 79, fontFamily: "ResumeTimes", fontSize: 9.2, color: "#111111", lineHeight: 1.28 },
  header: { borderBottomWidth: 1, borderBottomColor: "#111111", paddingBottom: 14, marginBottom: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", gap: 24 },
  identity: { flexGrow: 1 },
  name: { fontFamily: "ResumePoppins", fontWeight: 700, fontSize: 25, color: "#111111", lineHeight: 1.02, letterSpacing: 1.4 },
  roles: { fontFamily: "ResumePoppins", fontWeight: 400, color: "#333333", fontSize: 10.5, marginTop: 9, lineHeight: 1.2 },
  links: { width: 220, alignItems: "flex-end", paddingTop: 3, gap: 3 },
  link: { fontFamily: "ResumePoppins", fontWeight: 400, color: "#222222", fontSize: 7.6, textAlign: "right" },
  section: { marginBottom: 14 },
  sectionTitle: { fontFamily: "ResumePoppins", fontWeight: 600, fontSize: 10.5, color: "#111111", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  paragraph: { marginBottom: 2 },
  experience: { marginBottom: 8, paddingBottom: 7, borderBottomWidth: 0.5, borderBottomColor: "#bdbdbd" },
  experienceHeader: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 2 },
  organization: { fontFamily: "ResumePoppins", fontWeight: 700, fontSize: 9.5 },
  period: { fontFamily: "ResumePoppins", fontWeight: 400, color: "#333333", fontSize: 8 },
  kind: { fontFamily: "ResumePoppins", fontWeight: 400, fontSize: 8, color: "#333333", marginBottom: 2 },
  technologies: { fontFamily: "ResumeTimes", fontWeight: 700, fontSize: 8.4, color: "#222222", marginTop: 3 },
  skillGroup: { marginBottom: 4 },
  skillGroupTitle: { fontFamily: "ResumeTimes", fontWeight: 700 },
  footer: { position: "absolute", bottom: 18, left: 46, right: 46, textAlign: "center", color: "#666666", fontSize: 7.5 },
})

export const StandardResumeDocument = ({ profile }: { profile: ResumeProfile }) => (
  <Document title={`${profile.name} — ${profile.roles[0]}`} author={profile.name} subject="Resume">
    <Page size="A4" style={styles.page} wrap={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.identity}>
            <Text style={styles.name}>{profile.name.split(" ")[0].toUpperCase()}</Text>
            <Text style={styles.name}>{profile.name.split(" ").slice(1).join(" ").toUpperCase()}</Text>
            <Text style={styles.roles}>{profile.roles.join(" · ")}</Text>
          </View>
          <View style={styles.links}>
            {profile.links.map((link) => <Text key={link.href} wrap={false} style={styles.link}>{link.label}: {link.href}</Text>)}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{profile.labels.summary}</Text>
        <Text style={styles.paragraph}>{profile.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{profile.labels.skills}</Text>
        {profile.skillGroups.map((group) => <Text key={group.title} style={styles.skillGroup}><Text style={styles.skillGroupTitle}>{group.title}: </Text>{group.skills.join(", ")}</Text>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{profile.labels.experience}</Text>
        {profile.experiences.map((experience) => (
          <View key={experience.organization} style={styles.experience}>
            <View style={styles.experienceHeader}><Text style={styles.organization}>{experience.organization}</Text><Text style={styles.period}>{experience.period}</Text></View>
            <Text style={styles.kind}>{experience.kind}</Text>
            <Text>{experience.description}</Text>
            {experience.skills.length > 0 && <Text style={styles.technologies}>{profile.labels.technologies}: {experience.skills.join(", ")}</Text>}
          </View>
        ))}
      </View>

      <Text fixed style={styles.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </Page>
  </Document>
)
