
export type Term = keyof typeof INTL_TERMS

export type language = "ptbr" | "en"

export type Terms = Record<Term, Record<language, string>>


export const INTL_TERMS = {
  WebDeveloper: {
    ptbr: "Desenvolvedor Web",
    en: "Web Developer"
  },
  FullStackWebDeveloper: {
    ptbr: "Desenvolvedor Web Full-Stack",
    en: "Full-Stack Web Developer"
  },
  All: {
    ptbr: "Todas",
    en: "All"
  },
  Volunteering: {
    ptbr: "Voluntariados",
    en: "Volunteering"
  },
  BudgetXpertDescription: {
    ptbr:
      "Contribuí para o desenvolvimento do <b>BudgetXpert</b>, uma plataforma SaaS de <b>gestão financeira e controle orçamentário</b>, implementando novas funcionalidades e melhorias voltadas à produtividade e experiência dos usuários.",
    en:
      "Contributed to the development of <b>BudgetXpert</b>, a SaaS platform for <b>financial management and budget control</b>, implementing new features and improvements focused on productivity and user experience."
  },
  SaludiiDescription: {
    ptbr:
      "Desenvolvi funcionalidades para a <b>Saludii</b>, uma plataforma que conecta <b>nutricionistas, pacientes e empresas</b>, atuando no desenvolvimento <b>frontend</b> e <b>backend</b> da aplicação.",
    en:
      "Developed features for <b>Saludii</b>, a platform that connects <b>nutritionists, patients, and companies</b>, working on both the <b>frontend</b> and <b>backend</b> of the application."
  },
  FreelancerDescription: {
    ptbr:
      "Atuei como <b>desenvolvedor freelancer</b>, projetando e desenvolvendo aplicações web completas, desde o planejamento até a implantação e gerenciamento da infraestrutura.",
    en:
      "Worked as a <b>freelance developer</b>, designing and developing complete web applications, from planning to deployment and infrastructure management."
  },
  TechLeadDescription: {
    ptbr:
      "Atuei como <b>desenvolvedor Full Stack</b> e <b>Tech Lead</b>, conduzindo um pequeno time, compartilhando conceitos técnicos em calls com voluntários e desenvolvendo soluções para <b>clientes reais</b> em projetos captados pela Tech Legion.",
    en:
      "Worked as a <b>Full-Stack Developer</b> and <b>Tech Lead</b>, leading a small team, sharing technical concepts with volunteers in calls, and building solutions for <b>real clients</b> through projects brought in by Tech Legion."
  },
  ZapFlowDescription: {
    ptbr:
      "Contribuí para o desenvolvimento do <b>ZapFlow</b>, uma plataforma <b>CRM SaaS</b> integrada ao <b>WhatsApp Business</b>, implementando funcionalidades de <b>chat</b>, <b>automações</b> e <b>mensagens em massa</b>.",
    en:
      "Contributed to the development of <b>ZapFlow</b>, a <b>SaaS CRM</b> platform integrated with <b>WhatsApp Business</b>, implementing <b>chat</b>, <b>automation</b>, and <b>bulk messaging</b> features."
  },
  DesignRushDescription: {
    ptbr:
      "Desenvolvi <b>landing pages</b> e soluções visuais para clientes, participando tanto da implementação quanto da criação da interface e experiência do usuário.",
    en:
      "Developed <b>landing pages</b> and visual solutions for clients, contributing to both the implementation and the design of the user interface and user experience."
  },
  TechLeadFrontendDescription: {
    ptbr:
      "Atuei como <b>Tech Lead</b> e <b>desenvolvedor Frontend</b>, apoiando tecnicamente a equipe e contribuindo para a evolução de aplicações web.",
    en:
      "Worked as a <b>Tech Lead</b> and <b>Frontend Developer</b>, providing technical guidance to the team and contributing to the evolution of web applications."
  },
  Experiences: {
    ptbr: "Experiências",
    en: "Experiences"
  },
  ProfessionalTimeline: {
    ptbr: "Trajetória profissional",
    en: "Professional timeline"
  },
  ProfessionalExperienceTotal: {
    ptbr: "Experiência profissional comprovada: {duration}",
    en: "Verified professional experience: {duration}"
  },
  About: {
    ptbr: "Sobre",
    en: "About"
  },
  Skills: {
    ptbr: "Habilidades",
    en: "Skills"
  },
  TechnologyStack: {
    ptbr: "Stack tecnológica",
    en: "Technology stack"
  },
  SkillsIntro: {
    ptbr: "Tecnologias que uso para transformar ideias em produtos.",
    en: "Technologies I use to turn ideas into products."
  },
  SkillsArtworkAlt: {
    ptbr: "Ilustração em pixel art de um notebook com código e uma caneca",
    en: "Pixel art illustration of a laptop with code and a coffee mug"
  },
  RecruiterSkillsArtworkAlt: {
    ptbr: "Ilustração em pixel art de uma janela de código e uma maleta",
    en: "Pixel art illustration of a code window and a briefcase"
  },
  SkillsTagDetail: {
    ptbr: "Na minha stack",
    en: "In my toolkit"
  },
  SkillsFrontendTitle: {
    ptbr: "Tecnologias do dia a dia",
    en: "Everyday technologies"
  },
  SkillsFrontendDescription: {
    ptbr: "Ferramentas que uso para criar interfaces, experiências e produtos na web.",
    en: "Tools I use to build interfaces, experiences, and products for the web."
  },
  SkillsBackendTitle: {
    ptbr: "Serviços e integrações",
    en: "Services and integrations"
  },
  SkillsBackendDescription: {
    ptbr: "Tecnologias que uso para desenvolver a lógica por trás dos produtos.",
    en: "Technologies I use to build the logic behind products."
  },
  SkillsDatabaseTitle: {
    ptbr: "Dados bem estruturados",
    en: "Well-structured data"
  },
  SkillsDatabaseDescription: {
    ptbr: "Bancos de dados e ferramentas para modelagem e persistência.",
    en: "Databases and tools for modeling and persistence."
  },
  SkillsTestsTitle: {
    ptbr: "Qualidade em cada entrega",
    en: "Quality in every release"
  },
  SkillsTestsDescription: {
    ptbr: "Ferramentas para verificar o comportamento e a confiabilidade do código.",
    en: "Tools to verify code behavior and reliability."
  },
  SkillsArchitectureTitle: {
    ptbr: "Estrutura para evoluir",
    en: "Built to evolve"
  },
  SkillsArchitectureDescription: {
    ptbr: "Práticas e padrões que ajudam a organizar soluções.",
    en: "Practices and patterns that help organize solutions."
  },
  SkillsToolsTitle: {
    ptbr: "Ferramentas de trabalho",
    en: "Tools of the trade"
  },
  SkillsToolsDescription: {
    ptbr: "Recursos que acompanham o desenvolvimento e a colaboração.",
    en: "Tools that support development and collaboration."
  },
  Projects: {
    ptbr: "Projetos",
    en: "Projects"
  },
  SelectedWork: {
    ptbr: "Trabalho selecionado",
    en: "Selected work"
  },
  ProjectsIntro: {
    ptbr: "Soluções reais, desafios diferentes e aprendizados que ficaram.",
    en: "Real solutions, different challenges, and lessons that stayed with me."
  },
  ViewProject: {
    ptbr: "Ver projeto",
    en: "View project"
  },
  VolunteerProjectCategory: {
    ptbr: "Voluntariado",
    en: "Volunteer"
  },
  Testimonials: {
    ptbr: "Depoimentos",
    en: "Testimonials"
  },
  ExperiencesIntro: {
    ptbr: "Uma trajetória construída entre produto, código e colaboração.",
    en: "A path built across product, code, and collaboration."
  },
  CareerPath: {
    ptbr: "Trajetória",
    en: "Career path"
  },
  ExperiencesArtworkAlt: {
    ptbr: "Ilustração em pixel art de uma pessoa subindo degraus",
    en: "Pixel art illustration of a person climbing steps"
  },
  TestimonialsEyebrow: {
    ptbr: "Depoimentos",
    en: "Testimonials"
  },
  TestimonialsIntro: {
    ptbr: "Experiências reais de pessoas que trabalharam comigo em diferentes projetos e contextos.",
    en: "Real experiences from people who worked with me across projects and contexts."
  },
  TestimonialsHeadline: {
    ptbr: "O que ficou para quem já construiu algo comigo.",
    en: "What stayed with those who built something with me."
  },
  TestimonialsBubblesAlt: {
    ptbr: "Dois balões de conversa em pixel art",
    en: "Two pixel art speech bubbles"
  },
  TestimonialsLaptopAlt: {
    ptbr: "Notebook em pixel art com símbolo de código",
    en: "Pixel art laptop with a code symbol"
  },
  FeedbackArtworkAlt: {
    ptbr: "Pessoa em pixel art segurando uma caneca com coração",
    en: "Pixel art person holding a mug with a heart"
  },
  FeedbackFormNote: {
    ptbr: "Sua experiência pode inspirar outras pessoas a construírem grandes projetos.",
    en: "Your experience may inspire others to build great projects."
  },
  Feedback: {
    ptbr: "Feedback",
    en: "Feedback"
  },
  Professional: {
    ptbr: "Profissional",
    en: "Professional"
  },
  Personal: {
    ptbr: "Pessoal",
    en: "Personal"
  },
  WestphalOrigin: {
    ptbr:
      "O sobrenome Westphal tem origem alemã e significa \"aquele que vem da Vestfália\" ou \"morador da parte ocidental\", indicando uma ligação geográfica com a região da Vestfália (Westfalen), na Alemanha.",
    en:
      "The surname Westphal has German origins and means \"one who comes from Westphalia\" or \"inhabitant of the western region\", indicating a geographical connection to the Westphalia (Westfalen) region in Germany."
  },
  FeedbackImportance: {
    ptbr:
      "Seu feedback é muito importante para mim e me ajuda a melhorar cada vez mais.",
    en:
      "Your feedback is very important to me and helps me continuously improve."
  },
  AboutRoleDescription: {
    ptbr:
      "Sou <b>{role}</b> com aproximadamente {yearExperience} de experiência no desenvolvimento de <b>aplicações web modernas, escaláveis e de alta performance</b>.",
    en:
      "I am a <b>{role}</b> with approximately {yearExperience} of experience in developing <b>modern, scalable, and high-performance web applications</b>."
  },
  Year: {
    ptbr: "ano(s)",
    en: "year(s)"
  },
  AboutPhilosophyDescription: {
    ptbr:
      "Acredito na tecnologia como uma ferramenta para transformar ideias em soluções que geram valor. Estou sempre em busca de <b>novos desafios, aprendizado contínuo</b> e oportunidades para evoluir como desenvolvedor.",
    en:
      "I believe technology is a tool for transforming ideas into solutions that create value. I am always seeking <b>new challenges, continuous learning</b>, and opportunities to grow as a developer."
  },
  Resume: {
    ptbr: "Currículo",
    en: "Resume"
  },
  ResumeSummary: {
    ptbr: "Resumo profissional",
    en: "Professional summary"
  },
  ResumeProfessionalSummary: {
    ptbr: "Desenvolvedor Web Full-Stack com experiência na criação de aplicações modernas, escaláveis e de alta performance, atuando com foco em qualidade técnica, produtividade e experiência do usuário.",
    en: "Full-Stack Web Developer experienced in building modern, scalable, high-performance applications, with a focus on technical quality, productivity, and user experience."
  },
  ResumeTechnologies: {
    ptbr: "Tecnologias",
    en: "Technologies"
  },
  Views: {
    ptbr: "Visualização(ões)",
    en: "View(s)"
  },
  Likes: {
    ptbr: "Curtida(s)",
    en: "Like(s)"
  },
  ProfessionalFeedbacks: {
    ptbr: "Feedback(s) profissional(is)",
    en: "Professional Feedback(s)"
  },
  Feedbacks: {
    ptbr: "Feedback(s)",
    en: "Feedback(s)"
  },
  ResumeViews: {
    ptbr: "Visualização(ões) de currículo",
    en: "Resume View(s)"
  },
  ResumeDownloads: {
    ptbr: "Currículo(s) baixado(s)",
    en: "Downloaded Resume(s)"
  },
  LeaveYourFeedback: {
    ptbr: "Deixe seu feedback",
    en: "Leave Your Feedback"
  },
  ShareYourOpinion: {
    ptbr: "Compartilhe sua opinião, sugestões ou críticas.",
    en: "Share your opinion, suggestions, or feedback."
  },
  DidYouLikeMyPortfolio: {
    ptbr: "Gostou do meu portfólio?",
    en: "Did You Like My Portfolio?"
  },
  FeedbackDescription: {
    ptbr:
      "Seu feedback é muito importante para mim e me ajuda a melhorar cada vez mais.",
    en:
      "Your feedback is very important to me and helps me continuously improve."
  },
  RecentPortfolioFeedbacks: {
    ptbr: "O que acharam do portfólio",
    en: "What people thought of the portfolio"
  },
  PortfolioCommentsCount: {
    ptbr: "{count} comentário(s)",
    en: "{count} comment(s)"
  },
  PortfolioVisitor: {
    ptbr: "Visitante do portfólio",
    en: "Portfolio visitor"
  },
  PortfolioFeedbackPublicationConsent: {
    ptbr: "Autorizo a publicação anônima deste comentário após revisão.",
    en: "I authorize this comment to be published anonymously after review."
  },
  RecentPortfolioFeedbacksEmpty: {
    ptbr: "Os primeiros comentários publicados aparecerão aqui.",
    en: "The first published comments will appear here."
  },
  PortfolioFeedbackCategoryNavigation: {
    ptbr: "Navegação",
    en: "Navigation"
  },
  PortfolioFeedbackCategoryContent: {
    ptbr: "Conteúdo",
    en: "Content"
  },
  PortfolioFeedbackCategoryRecruiter: {
    ptbr: "Recrutador",
    en: "Recruiter"
  },
  PortfolioFeedbackCategoryDesign: {
    ptbr: "Design",
    en: "Design"
  },
  PortfolioFeedbackCategoryGeneral: {
    ptbr: "Geral",
    en: "General"
  },
  LeaveALike: {
    ptbr: "Deixar um like",
    en: "Leave a Like"
  },
  Liked: {
    ptbr: "Curtido",
    en: "Liked"
  },
  Liking: {
    ptbr: "Curtindo",
    en: "Liking"
  },
  GiveFeedback: {
    ptbr: "Dar um feedback",
    en: "Give Feedback"
  },
  SubmitFeedback: {
    ptbr: "Enviar feedback",
    en: "Submit Feedback"
  },
  FeedbackMessage: {
    ptbr: "Seu feedback",
    en: "Your feedback"
  },
  FeedbackMessagePlaceholder: {
    ptbr: "Escreva seu feedback aqui",
    en: "Write your feedback here"
  },
  LinkedinUrl: {
    ptbr: "URL do LinkedIn (opcional)",
    en: "LinkedIn URL (optional)"
  },
  FeedbackConsent: {
    ptbr: "Autorizo a avaliação deste feedback para uma possível publicação após revisão.",
    en: "I authorize this feedback to be considered for possible publication after review."
  },
  FeedbackReceived: {
    ptbr: "Seu feedback foi recebido e será analisado antes de qualquer publicação. Obrigado por compartilhar sua experiência.",
    en: "Your feedback was received and will be reviewed before any publication. Thank you for sharing your experience."
  },
  FeedbackSubmissionError: {
    ptbr: "Não foi possível enviar seu feedback. Tente novamente.",
    en: "Your feedback could not be sent. Please try again."
  },
  FeedbackSentToastTitle: {
    ptbr: "Feedback enviado",
    en: "Feedback sent"
  },
  FeedbackSentToastDescription: {
    ptbr: "Obrigado por compartilhar sua opinião.",
    en: "Thank you for sharing your opinion."
  },
  FeedbackErrorToastTitle: {
    ptbr: "Erro ao enviar",
    en: "Could not send"
  },
  LikeErrorToastTitle: {
    ptbr: "Erro ao curtir",
    en: "Could not like"
  },
  LikeSubmissionError: {
    ptbr: "Não foi possível registrar sua curtida. Tente novamente.",
    en: "Your like could not be registered. Please try again."
  },
  PortfolioLikedToastTitle: {
    ptbr: "Portfólio curtido",
    en: "Portfolio liked"
  },
  PortfolioLikedToastDescription: {
    ptbr: "Sua curtida foi registrada.",
    en: "Your like was registered."
  },
  MessageReceivedToastTitle: {
    ptbr: "Mensagem recebida!",
    en: "Message received!"
  },
  MessageReceivedToastDescription: {
    ptbr: "Valeu por ajudar a melhorar o portfólio.",
    en: "Thanks for helping improve the portfolio."
  },
  Undo: {
    ptbr: "Desfazer",
    en: "Undo"
  },
  ViewFeedback: {
    ptbr: "Ver feedback",
    en: "View feedback"
  },
  CloseNotification: {
    ptbr: "Fechar notificação",
    en: "Close notification"
  },
  Logout: {
    ptbr: "Sair",
    en: "Log out"
  },
  HaveYouWorkedWithMe: {
    ptbr: "Já trabalhou comigo?",
    en: "Have You Worked With Me?"
  },
  ShareYourTestimonial: {
    ptbr: "Compartilhe seu relato aqui.",
    en: "Share Your Testimonial Here."
  },
  TestimonialLeo: {
    ptbr:
      "É uma honra ter cruzado o caminho do <b>Augusto Westphal</b> e um orgulho estar ao seu lado, onde tive a oportunidade de conhecer um <b>excelente profissional</b> e uma <b>pessoa incrível</b>. Parabéns pelo projeto, meu nobre 👏.",
    en:
      "It is an honor to have crossed paths with <b>Augusto Westphal</b> and a privilege to have been by his side, where I had the opportunity to meet an <b>excellent professional</b> and an <b>incredible person</b>. Congratulations on the project, my friend 👏."
  },
  TechLegionCEO: {
    ptbr: "CEO da Tech Legion",
    en: "CEO of Tech Legion"
  },
  TestimonialEmanuel: {
    ptbr:
      "Eu tive o prazer de trabalhar com Augusto em alguns projetos e posso dizer com confiança que ele é um <b>profissional excepcional</b>. Suas habilidades <b>analíticas e técnicas</b> são impressionantes, além de ser um <b>designer gráfico talentoso</b> e um <b>desenvolvedor excepcional</b>.",
    en:
      "I had the pleasure of working with Augusto on some projects, and I can confidently say that he is an <b>exceptional professional</b>. His <b>analytical and technical skills</b> are impressive, in addition to being a <b>talented graphic designer</b> and an <b>outstanding developer</b>."
  },
  SoftwareDeveloper: {
    ptbr: "Desenvolvedor de Software",
    en: "Software Developer"
  },
  TestimonialItalo: {
    ptbr:
      "É incrível como tudo que tu faz é meio que um pouco a tua cara, você é um <b>desenvolvedor como poucos</b>.",
    en:
      "It is incredible how everything you do carries a bit of your personality; you are a <b>developer like few others</b>."
  },
  TestimonialSamir: {
    ptbr:
      "Minha primeira experiência com Augusto como desenvolvedor web foi incrível. Ele é <b>altamente habilidoso</b>, mantém uma <b>excelente comunicação</b> no trabalho remoto e é <b>proativo</b> em impulsionar projetos com novas ideias.",
    en:
      "My first experience working with Augusto as a web developer was incredible. He is <b>highly skilled</b>, maintains <b>excellent communication</b> in remote work, and is <b>proactive</b> in driving projects forward with new ideas."
  },
  FrontendWebDeveloper: {
    ptbr: "Desenvolvedor Web Frontend",
    en: "Frontend Web Developer"
  },
  TestimonialWarllei: {
    ptbr:
      "É com prazer que recomendo Augusto Westphal como um <b>desenvolvedor Full-Stack altamente competente</b>. Durante nosso tempo juntos na <b>DRT Sistemas</b>, demonstrou domínio em <b>Node.js</b>, <b>React.js</b> e <b>Next.js</b>, entregando projetos de alta qualidade.",
    en:
      "It is my pleasure to recommend Augusto Westphal as a <b>highly skilled Full-Stack Developer</b>. During our time together at <b>DRT Sistemas</b>, he demonstrated expertise in <b>Node.js</b>, <b>React.js</b>, and <b>Next.js</b>, delivering high-quality projects."
  },
  Recruiter: {
    ptbr: "Sou Recrutador(a)",
    en: "I am a Recruiter"
  },
  Language: {
    ptbr: "Idioma",
    en: "Language"
  },
  Month: {
    ptbr: "mês(es)",
    en: "month(s)"
  },
  Day: {
    ptbr: "dia(s)",
    en: "day(s)"
  },
  And: {
    ptbr: "e",
    en: "and"
  },
  CustomizePortfolioForYourPosition: {
    ptbr: "Personalize este portfólio para a sua vaga",
    en: "Customize This Portfolio for Your Position"
  },
  RecruiterModeDescription: {
    ptbr:
      "Analise meu perfil com base nos requisitos da sua vaga e gere um currículo personalizado em menos de um minuto.",
    en:
      "Analyze my profile based on your job requirements and generate a personalized resume in less than a minute."
  },
  JobDescriptionOrLink: {
    ptbr: "Descrição ou link da vaga",
    en: "Job Description or Job Posting URL"
  },
  PasteJobDescriptionOrUrl: {
    ptbr: "Cole a descrição ou a URL da vaga...",
    en: "Paste the job description or job posting URL..."
  },
  AnalyzeJob: {
    ptbr: "Analisar Vaga",
    en: "Analyze Job"
  },
  AnswerQuestions: {
    ptbr: "Responder perguntas",
    en: "Answer Questions"
  },
  DefaultMode: {
    ptbr: "Modo Padrão",
    en: "Default Mode"
  },
  RecruitmentMode: {
    ptbr: "Modo Recrutamento",
    en: "Recruitment Mode"
  },
  GeneralReading: {
    ptbr: "Visão geral",
    en: "Overview"
  },
  ProfessionalProfile: {
    ptbr: "Ficha profissional",
    en: "Professional profile"
  },
  Role: {
    ptbr: "Atuação",
    en: "Role"
  },
  Seniority: {
    ptbr: "Senioridade",
    en: "Seniority"
  },
  Junior: {
    ptbr: "Júnior",
    en: "Junior"
  },
  Senior: {
    ptbr: "Sênior",
    en: "Senior"
  },
  RefineRecruiterReading: {
    ptbr: "Refine esta leitura",
    en: "Refine this view"
  },
  RecruiterQuestionsDescription: {
    ptbr: "Selecione uma ou mais áreas e a senioridade da vaga para priorizar as evidências mais relevantes.",
    en: "Select one or more role areas and the seniority to prioritize the most relevant evidence."
  },
  RecruiterModeBadge: {
    ptbr: "Modo recrutador",
    en: "Recruiter mode"
  },
  YourReading: {
    ptbr: "Sua leitura",
    en: "Your view"
  },
  SelectedAreas: {
    ptbr: "Áreas",
    en: "Areas"
  },
  NoContextSelected: {
    ptbr: "Ainda não há seleção",
    en: "No selection yet"
  },
  RecruiterEvidenceOrganized: {
    ptbr: "Evidências organizadas para esta vaga.",
    en: "Evidence organized for this role."
  },
  RecruiterSectionsPrioritized: {
    ptbr: "As seções abaixo serão priorizadas automaticamente.",
    en: "The sections below will be prioritized automatically."
  },
  ClearRecruiterContext: {
    ptbr: "Limpar seleção",
    en: "Clear selection"
  },
  Selected: {
    ptbr: "Selecionado",
    en: "Selected"
  },
  RoleOrStack: {
    ptbr: "Área ou stack da vaga",
    en: "Job role or stack"
  },
  JobSeniority: {
    ptbr: "Senioridade da vaga",
    en: "Job seniority"
  },
  SeniorityComparison: {
    ptbr: "Vaga: {vacancy}. Perfil declarado: {profile}.",
    en: "Role: {vacancy}. Declared profile: {profile}."
  },
  MidLevel: {
    ptbr: "Pleno (mid-level)",
    en: "Mid-level"
  },
  OtherProfiles: {
    ptbr: "Outros perfis para considerar",
    en: "Other profiles to consider"
  },
  RecommendationHonestBadge: {
    ptbr: "Recomendação honesta",
    en: "Honest recommendation"
  },
  RecommendationHonestTitle: {
    ptbr: "Talvez outro perfil combine melhor",
    en: "Another profile may be a better fit"
  },
  RecommendationHonestDescription: {
    ptbr: "Meu perfil não cobre totalmente os critérios selecionados. Para não limitar sua busca, separei outros profissionais que podem fazer sentido para a vaga.",
    en: "My profile does not fully cover the selected criteria. To avoid limiting your search, I selected other professionals who may be relevant to the role."
  },
  RecommendationConditionalNote: {
    ptbr: "Esta seção aparece somente quando não há correspondência completa.",
    en: "This section only appears when there is no complete match."
  },
  RecommendedProfiles: {
    ptbr: "Perfis recomendados",
    en: "Recommended profiles"
  },
  RecommendationCount: {
    ptbr: "{current} de {total}",
    en: "{current} of {total}"
  },
  RecommendationTechnologies: {
    ptbr: "Tecnologias",
    en: "Technologies"
  },
  PreviousRecommendation: {
    ptbr: "Perfil anterior",
    en: "Previous profile"
  },
  NextRecommendation: {
    ptbr: "Próximo perfil",
    en: "Next profile"
  },
  ViewAllRecommendations: {
    ptbr: "Ver todos",
    en: "View all"
  },
  ViewRecommendationCarousel: {
    ptbr: "Ver carrossel",
    en: "View carousel"
  },
  RecommendationNavigation: {
    ptbr: "Navegação entre perfis",
    en: "Profile navigation"
  },
  GoToRecommendation: {
    ptbr: "Ir para o perfil {position}",
    en: "Go to profile {position}"
  },
  RecommendationCarouselHelp: {
    ptbr: "Use as setas ou selecione um marcador para conhecer outros perfis.",
    en: "Use the arrows or select a marker to browse other profiles."
  },
  RecommendationDisclosure: {
    ptbr: "Perfis apresentados com base nas informações fornecidas pelos profissionais.",
    en: "Profiles shown based on information provided by the professionals."
  },
  Blog: {
    ptbr: "Blog",
    en: "Blog"
  },
  PortfolioBlogEyebrow: {
    ptbr: "Do código para o café",
    en: "From code to coffee"
  },
  PortfolioBlogTitle: {
    ptbr: "Em alta no blog",
    en: "Trending on the blog"
  },
  PortfolioBlogDescription: {
    ptbr: "O conteúdo que mais chamou atenção por aqui.",
    en: "The story that caught the most attention around here."
  },
  PortfolioBlogExplore: {
    ptbr: "Explorar o blog",
    en: "Explore the blog"
  },
  PortfolioBlogPopular: {
    ptbr: "Em alta",
    en: "Trending"
  },
  PortfolioBlogLikes: {
    ptbr: "{likes} curtidas",
    en: "{likes} likes"
  },
  PortfolioBlogPublished: {
    ptbr: "Publicado em {date}",
    en: "Published on {date}"
  },
  AdminPanel: {
    ptbr: "Painel administrativo",
    en: "Admin panel"
  },
  AdminOperationSuccessTitle: {
    ptbr: "Alteração concluída",
    en: "Change completed"
  },
  AdminOperationErrorTitle: {
    ptbr: "Não foi possível concluir",
    en: "Unable to complete"
  },
  AdminSaveSuccess: {
    ptbr: "As informações foram salvas.",
    en: "The information was saved."
  },
  AdminSaveError: {
    ptbr: "Não foi possível salvar as informações. Tente novamente.",
    en: "The information could not be saved. Please try again."
  },
  AdminRemoveSuccess: {
    ptbr: "O item foi removido.",
    en: "The item was removed."
  },
  AdminRemoveError: {
    ptbr: "Não foi possível remover o item. Tente novamente.",
    en: "The item could not be removed. Please try again."
  },
  AdminUploadSuccess: {
    ptbr: "O arquivo foi enviado.",
    en: "The file was uploaded."
  },
  AdminUploadError: {
    ptbr: "Não foi possível enviar o arquivo. Tente novamente.",
    en: "The file could not be uploaded. Please try again."
  },
  AdminLoginSuccess: {
    ptbr: "Acesso ao painel autorizado.",
    en: "Admin access authorized."
  },
  AdminLoginError: {
    ptbr: "E-mail ou senha inválidos.",
    en: "Invalid email or password."
  },
  AdminLoginAttemptsRemaining: {
    ptbr: "{count} tentativas disponíveis.",
    en: "{count} attempts available."
  },
  AdminLoginAttemptRemaining: {
    ptbr: "1 tentativa disponível.",
    en: "1 attempt available."
  },
  AdminLoginRateLimited: {
    ptbr: "Limite de tentativas atingido. Tente novamente em {time}.",
    en: "Attempt limit reached. Try again in {time}."
  },
  AdminLoginDescription: {
    ptbr: "Acesso restrito ao portfólio.",
    en: "Restricted portfolio access."
  },
  Email: {
    ptbr: "E-mail",
    en: "Email"
  },
  Password: {
    ptbr: "Senha",
    en: "Password"
  },
  SignIn: {
    ptbr: "Entrar",
    en: "Sign in"
  },
  SigningIn: {
    ptbr: "Entrando",
    en: "Signing in"
  },
  AdminLogoutSuccess: {
    ptbr: "Você saiu do painel administrativo.",
    en: "You signed out of the admin panel."
  },
  AdminLogoutError: {
    ptbr: "Não foi possível sair do painel. Tente novamente.",
    en: "Unable to sign out of the admin panel. Please try again."
  },
  ViewOtherProfiles: {
    ptbr: "Ver outros perfis",
    en: "View other profiles"
  },
  RecommendationEmpty: {
    ptbr: "Não há outros perfis publicados para este contexto no momento.",
    en: "There are no other published profiles for this context at the moment."
  },
  RecommendationContact: {
    ptbr: "Entrar em contato",
    en: "Get in touch"
  },
  Availability: {
    ptbr: "Disponibilidade",
    en: "Availability"
  },
  Remote: {
    ptbr: "Remoto",
    en: "Remote"
  },
  Location: {
    ptbr: "Localização",
    en: "Location"
  },
  GuarapariES: {
    ptbr: "Guarapari, ES",
    en: "Guarapari, ES, Brazil"
  },
  Experience: {
    ptbr: "Experiência",
    en: "Experience"
  },
  PrimaryStack: {
    ptbr: "Stack com evidências",
    en: "Evidence-backed stack"
  },
  EvidenceBySkill: {
    ptbr: "Evidências por habilidade",
    en: "Evidence by skill"
  },
  EvidenceBySkillDescription: {
    ptbr: "Tecnologias organizadas por experiência profissional, projetos e aprendizado aplicado.",
    en: "Technologies organized by professional experience, projects, and applied learning."
  },
  EvidenceHeadline: {
    ptbr: "Experiência que aparece na prática",
    en: "Experience that shows in practice"
  },
  EvidenceHeadlineDescription: {
    ptbr: "Tecnologias que utilizo no dia a dia, com evidências reais de onde foram aplicadas.",
    en: "Technologies I use day to day, with real evidence of where they were applied."
  },
  ViewEvidence: {
    ptbr: "Ver evidências",
    en: "View evidence"
  },
  LearningRecorded: {
    ptbr: "Aprendizado registrado",
    en: "Learning recorded"
  },
  NoEvidenceLinked: {
    ptbr: "Sem evidências vinculadas",
    en: "No linked evidence"
  },
  NoEvidenceLinkedDescription: {
    ptbr: "Experiências e projetos ainda não associados.",
    en: "Experiences and projects are not associated yet."
  },
  ProfessionalExperiences: {
    ptbr: "experiência(s) profissional(is)",
    en: "professional experience(s)"
  },
  ProjectsBuilt: {
    ptbr: "projeto(s)",
    en: "project(s)"
  },
  Evidence: {
    ptbr: "Evidências",
    en: "Evidence"
  },
  Courses: {
    ptbr: "Cursos e certificações",
    en: "Courses and certifications"
  },
  LearningInContext: {
    ptbr: "Aprendizado em contexto",
    en: "Learning in context"
  },
  SaludiiRedwoodLearningDelivery: {
    ptbr: "Aprendi Redwood.js para contribuir com um MVP entregue ao uso de dezenas de nutricionistas.",
    en: "Learned Redwood.js to contribute to an MVP delivered for use by dozens of nutritionists."
  },
  ZapFlowNestLearningDelivery: {
    ptbr: "Aprendi NestJS para contribuir com o MVP ZapFlow, entregue ao uso de milhares de pessoas.",
    en: "Learned NestJS to contribute to the ZapFlow MVP, delivered for use by thousands of people."
  },
  ZapFlowPostgresLearningDelivery: {
    ptbr: "Aprendi PostgreSQL para contribuir com o MVP ZapFlow, entregue ao uso de milhares de pessoas.",
    en: "Learned PostgreSQL to contribute to the ZapFlow MVP, delivered for use by thousands of people."
  },
  BudgetXpertSqlServerLearningDelivery: {
    ptbr: "Aprendi SQL Server para contribuir com uma plataforma usada por dezenas de empresas de médio e grande porte.",
    en: "Learned SQL Server to contribute to a platform used by dozens of mid-sized and large companies."
  },
  ShowHiddenSkills: {
    ptbr: "Ver mais {count} habilidade(s)",
    en: "Show {count} more skill(s)"
  },
  ContactMe: {
    ptbr: "Vamos conversar",
    en: "Let's talk"
  },
  Contact: {
    ptbr: "Contato",
    en: "Contact"
  },
  RecruiterContactDescription: {
    ptbr: "Encontrou evidências relevantes? Estou disponível para conversar sobre contexto, desafios e próximos passos.",
    en: "Found relevant evidence? I'm available to discuss context, challenges, and next steps."
  },
  ChooseContactChannel: {
    ptbr: "Escolha o melhor canal",
    en: "Choose the best channel"
  },
  ConversationStart: {
    ptbr: "Uma boa conversa pode ser o começo de um grande projeto.",
    en: "A good conversation can be the start of a great project."
  },
  FeedbackClosing: {
    ptbr: "Sua opinião ajuda a tornar este portfólio melhor.",
    en: "Your thoughts help make this portfolio better."
  },
  Greeting: {
    ptbr: "Olá, eu sou",
    en: "Hi, I'm"
  },
  TechLegionWebsiteDescription: {
    ptbr:
      "Desenvolvi voluntariamente e de forma independente o <b>site institucional da TechLegion</b>, incluindo um <b>blog completo</b> com <b>dashboard de gerenciamento</b>, <b>controle de permissões</b> e sistema de publicação de conteúdo.",
    en:
      "Volunteered independently to develop the <b>TechLegion institutional website</b>, including a <b>full-featured blog</b> with a <b>management dashboard</b>, <b>permission control</b>, and a content publishing system."
  },
  OnlinksDescription: {
    ptbr:
      "Desenvolvi voluntariamente o <b>Onlinks</b>, uma plataforma para criação de <b>páginas de links personalizadas</b> com suporte a <b>múltiplos perfis</b> e gerenciamento centralizado de conteúdo.",
    en:
      "Volunteered to develop <b>Onlinks</b>, a platform for creating <b>customized link pages</b> with support for <b>multiple profiles</b> and centralized content management."
  },
  CodeQuizDescription: {
    ptbr:
      "Desenvolvi o <b>QuizDev</b>, uma plataforma para <b>criação e compartilhamento de desafios de programação</b>, permitindo que usuários criem quizzes, testem seus conhecimentos e desafiem outros desenvolvedores.",
    en:
      "Developed <b>QuizDev</b>, a platform for <b>creating and sharing programming challenges</b>, allowing users to create quizzes, test their knowledge, and challenge other developers."
  },
  PortfolioBioLinksDescription: {
    ptbr:
      "Desenvolvi meu <b>portfólio pessoal</b> com foco em <b>experiência do usuário</b>, apresentando minha trajetória, projetos e habilidades por meio de uma interface moderna, interativa e altamente personalizável.",
    en:
      "Developed my <b>personal portfolio</b> with a focus on <b>user experience</b>, showcasing my career path, projects, and skills through a modern, interactive, and highly customizable interface."
  },
  PortfolioCMSDescription: {
    ptbr:
      "Desenvolvi um <b>portfólio com CMS próprio</b>, permitindo o gerenciamento de projetos, sincronização com o <b>GitHub</b> e acompanhamento de métricas como visualizações e favoritos.",
    en:
      "Developed a <b>portfolio with its own CMS</b>, enabling project management, synchronization with <b>GitHub</b>, and tracking metrics such as views and favorites."
  },
  FrontEnd: {
    ptbr: "Front-End",
    en: "Front-End"
  },
  BackEnd: {
    ptbr: "Back-End",
    en: "Back-End"
  },
  Database: {
    ptbr: "Banco de Dados",
    en: "Database"
  },
  Tests: {
    ptbr: "Testes",
    en: "Tests"
  },
  Architecture: {
    ptbr: "Arquitetura",
    en: "Architecture"
  },
  Tools: {
    ptbr: "Ferramentas",
    en: "Tools"
  },
  BlogHeroTitleFirst: {
    ptbr: "Uma ideia boa.",
    en: "One good idea."
  },
  BlogHeroTitleSecond: {
    ptbr: "Cinco minutos.",
    en: "Five minutes."
  },
  BlogHeroDescription: {
    ptbr: "Conteúdos diretos e práticos sobre desenvolvimento, para você aprender algo novo todos os dias.",
    en: "Direct, practical notes on development, so you can learn something new every day."
  },
  BlogHeroArtAlt: {
    ptbr: "Desenvolvedor com café e notebook, desenhado em caracteres ASCII",
    en: "Developer with coffee and laptop, drawn in ASCII characters"
  },
  BlogCacheArtAlt: {
    ptbr: "Três blocos de memória em pilha",
    en: "Three stacked memory blocks"
  },
  BlogApiArtAlt: {
    ptbr: "Duas janelas conectadas por uma API",
    en: "Two windows connected by an API"
  },
  BlogBugArtAlt: {
    ptbr: "Ilustração de um bug",
    en: "Illustration of a bug"
  },
  BlogReadingTimeFilter: {
    ptbr: "Tempo disponível para leitura",
    en: "Available reading time"
  },
  BlogMinutesOption: {
    ptbr: "{minutes} min",
    en: "{minutes} min"
  },
  BlogReadingMinutes: {
    ptbr: "{minutes} min de leitura",
    en: "{minutes} min read"
  },
  BlogFeaturedArticles: {
    ptbr: "Artigos em destaque",
    en: "Featured articles"
  },
  BlogArticle: {
    ptbr: "Artigo",
    en: "Article"
  },
  BlogContinueReading: {
    ptbr: "Continuar lendo",
    en: "Keep reading"
  },
  BlogMoreArticlesSoon: {
    ptbr: "Mais leituras estão a caminho.",
    en: "More stories are on their way."
  },
  BlogEditorial: {
    ptbr: "Editorial",
    en: "Editorial"
  },
  BlogEmptyTitle: {
    ptbr: "Boas ideias estão chegando.",
    en: "Good ideas are on their way."
  },
  BlogEmptyDescription: {
    ptbr: "Ainda não há artigos publicados. Em breve, este espaço terá conteúdos práticos sobre desenvolvimento.",
    en: "No articles have been published yet. Soon, this space will have practical development content."
  },
  BlogFilterEmpty: {
    ptbr: "Ainda não há artigos para esse tempo de leitura. Experimente outro filtro ou veja todos.",
    en: "There are no articles for that reading time yet. Try another filter or view all."
  },
  BlogShowAll: {
    ptbr: "Ver todos os artigos",
    en: "View all articles"
  },
  BlogCoffeeTitle: {
    ptbr: "Para ler no café",
    en: "Read over coffee"
  },
  BlogCoffeeDescription: {
    ptbr: "Uma seleção de ideias, ferramentas e boas práticas.",
    en: "A selection of ideas, tools, and good practices."
  },
  Home: {
    ptbr: "Início",
    en: "Home"
  },
  BlogBreadcrumbLabel: {
    ptbr: "Caminho da página",
    en: "Page path"
  },
  BlogSave: {
    ptbr: "Salvar",
    en: "Save"
  },
  BlogSaved: {
    ptbr: "Salvo",
    en: "Saved"
  },
  BlogShare: {
    ptbr: "Compartilhar",
    en: "Share"
  },
  BlogLinkCopied: {
    ptbr: "Link copiado",
    en: "Link copied"
  },
  BlogTableOfContents: {
    ptbr: "Sumário do artigo",
    en: "Article contents"
  },
  BlogInThisArticle: {
    ptbr: "Neste artigo",
    en: "In this article"
  },
  BlogWasThisClear: {
    ptbr: "Ficou claro?",
    en: "Was this clear?"
  },
  BlogViews: {
    ptbr: "{views} visualizações",
    en: "{views} views"
  },
  BlogLiking: {
    ptbr: "Curtindo",
    en: "Liking"
  },
  BlogLiked: {
    ptbr: "Curtido",
    en: "Liked"
  },
  BlogYesClear: {
    ptbr: "Sim!",
    en: "Yes!"
  },
  BlogStillHaveQuestion: {
    ptbr: "Ainda tenho dúvida",
    en: "I still have a question"
  },
  BlogMoreReading: {
    ptbr: "Mais uma gota?",
    en: "One more idea?"
  },
  NavigationMenu: {
    ptbr: "Menu de navegação",
    en: "Navigation menu"
  },
  SocialMedia: {
    ptbr: "Redes sociais",
    en: "Social media"
  },
  FooterCopyright: {
    ptbr: "© {year} {name}. Todos os direitos reservados.",
    en: "© {year} {name}. All rights reserved."
  },
  AdminTitle: {
    ptbr: "Administração",
    en: "Administration"
  },
  AdminNavigation: {
    ptbr: "Navegação administrativa",
    en: "Administration navigation"
  },
  AdminDashboardNav: {
    ptbr: "Painel",
    en: "Dashboard"
  },
  AdminRecommendationsNav: {
    ptbr: "Indicações",
    en: "Recommendations"
  },
  AdminDashboardDescription: {
    ptbr: "Use a navegação lateral para acessar cada área administrativa.",
    en: "Use the side navigation to access each administrative area."
  },
  AdminLoginAttemptsTitle: {
    ptbr: "Acessos de login",
    en: "Login access"
  },
  AdminLoginAttemptsDescription: {
    ptbr: "Acompanhe as janelas ativas de tentativas por IP e libere um endereço quando necessário.",
    en: "Monitor active attempt windows by IP and release an address when needed."
  },
  AdminLoginAttemptsLoading: {
    ptbr: "Carregando tentativas de login...",
    en: "Loading login attempts..."
  },
  AdminLoginAttemptsLoadError: {
    ptbr: "Não foi possível carregar as tentativas de login.",
    en: "Unable to load login attempts."
  },
  AdminLoginAttemptsEmpty: {
    ptbr: "Não há janelas de tentativas ativas.",
    en: "There are no active attempt windows."
  },
  AdminLoginAttemptsBlocked: {
    ptbr: "Bloqueado",
    en: "Blocked"
  },
  AdminLoginAttemptsActive: {
    ptbr: "Ativo",
    en: "Active"
  },
  AdminLoginAttemptsCount: {
    ptbr: "{count} de {limit} tentativas utilizadas",
    en: "{count} of {limit} attempts used"
  },
  AdminLoginAttemptsLastAttempt: {
    ptbr: "Última tentativa: {date}",
    en: "Last attempt: {date}"
  },
  AdminLoginAttemptsExpiresAt: {
    ptbr: "Reset automático: {date}",
    en: "Automatic reset: {date}"
  },
  AdminLoginAttemptsReset: {
    ptbr: "Resetar tentativas",
    en: "Reset attempts"
  },
  AdminLoginAttemptsResetting: {
    ptbr: "Resetando",
    en: "Resetting"
  },
  AdminLoginAttemptsResetSuccess: {
    ptbr: "As tentativas do IP foram resetadas.",
    en: "The IP attempts were reset."
  },
  AdminLoginAttemptsResetError: {
    ptbr: "Não foi possível resetar as tentativas do IP.",
    en: "Unable to reset the IP attempts."
  },
  AdminPublicRateLimitsTitle: {
    ptbr: "Limites das rotas públicas",
    en: "Public route limits"
  },
  AdminPublicRateLimitsDescription: {
    ptbr: "Acompanhe e resete os buckets ativos por endpoint, IP ou visitante.",
    en: "Monitor and reset active buckets by endpoint, IP, or visitor."
  },
  AdminPublicRateLimitsLoading: {
    ptbr: "Carregando limites das rotas públicas...",
    en: "Loading public route limits..."
  },
  AdminPublicRateLimitsLoadError: {
    ptbr: "Não foi possível carregar os limites das rotas públicas.",
    en: "Unable to load public route limits."
  },
  AdminPublicRateLimitsEmpty: {
    ptbr: "Não há buckets públicos ativos.",
    en: "There are no active public buckets."
  },
  AdminPublicRateLimitsIp: {
    ptbr: "IP",
    en: "IP"
  },
  AdminPublicRateLimitsVisitor: {
    ptbr: "Visitante",
    en: "Visitor"
  },
  AdminPublicRateLimitsResetSuccess: {
    ptbr: "O limite selecionado foi resetado.",
    en: "The selected limit was reset."
  },
  AdminPublicRateLimitsResetError: {
    ptbr: "Não foi possível resetar o limite selecionado.",
    en: "Unable to reset the selected limit."
  },
  AdminProfessionalFeedbacksTitle: {
    ptbr: "Feedbacks profissionais",
    en: "Professional feedback"
  },
  AdminProfessionalFeedbacksDescription: {
    ptbr: "Modere os relatos que podem aparecer publicamente no portfólio.",
    en: "Moderate the testimonials that may appear publicly in the portfolio."
  },
  AdminPortfolioFeedbacksTitle: {
    ptbr: "Feedbacks do portfólio",
    en: "Portfolio feedback"
  },
  AdminPortfolioFeedbacksDescription: {
    ptbr: "Revise as mensagens dos visitantes e publique somente as adequadas. A retenção é de 90 dias.",
    en: "Review visitor messages and publish only suitable ones. Retention is 90 days."
  },
  AdminPortfolioFeedbackCategory: {
    ptbr: "Categoria pública",
    en: "Public category"
  },
  AdminPortfolioFeedbackPublish: {
    ptbr: "Publicar",
    en: "Publish"
  },
  AdminPortfolioFeedbackHide: {
    ptbr: "Ocultar",
    en: "Hide"
  },
  AdminPortfolioFeedbackSaving: {
    ptbr: "Salvando",
    en: "Saving"
  },
  AdminPortfolioFeedbackPublished: {
    ptbr: "Publicado",
    en: "Published"
  },
  AdminPortfolioFeedbackPending: {
    ptbr: "Privado",
    en: "Private"
  },
  AdminPortfolioFeedbackAuthorized: {
    ptbr: "Publicação autorizada",
    en: "Publication authorized"
  },
  AdminPortfolioFeedbackNotAuthorized: {
    ptbr: "Sem autorização para publicar",
    en: "Not authorized for publication"
  },
  AdminPortfolioFeedbacksEmpty: {
    ptbr: "Não há feedbacks do portfólio no período de retenção.",
    en: "There is no portfolio feedback within the retention period."
  },
  AdminVisitorLabel: {
    ptbr: "Visitante",
    en: "Visitor"
  },
  AdminLoadMore: {
    ptbr: "Carregar mais",
    en: "Load more"
  },
  Menu: {
    ptbr: "Menu",
    en: "Menu"
  },
  Portfolio: {
    ptbr: "Portfólio",
    en: "Portfolio"
  }
} as const
