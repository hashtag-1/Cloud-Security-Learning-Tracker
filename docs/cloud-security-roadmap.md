# Cloud Security Career Research Report

*Research window: Q1–Q3 2026 market data. All timelines assume ~15–20 focused hours/week.*

## Executive Summary

**Current state.** Cloud security is the most supply-constrained technical hiring category in security. ISC2's 2025 Workforce Study ranks cloud security as the #1 skill hiring managers recruit for and the #2 skills gap globally, behind only AI. One 2026 platform dataset put open cloud security roles against qualified candidates at roughly 3.7:1, unchanged for three quarters. Security is the only major US tech posting category above its pre-pandemic baseline (~113%), while software dev and data sit at ~62–71%.

**Demand outlook.** BLS projects 29% growth for information security analysts 2024–2034. But hiring is *uneven*: it has cooled at the junior end and concentrated at the experienced end. Employers routinely label 2–3 year roles "entry-level." This is the single most important fact for your planning — the job market you are targeting does not hire on potential, it hires on demonstrated infrastructure competence.

**Compensation.** US mid-level security engineer bands sit ~$110–148K; cloud security and architecture specialisation pushes $128–220K, with major-metro cloud security engineer base ranges reported at $155–255K (Northern Virginia highest, driven by federal/IC demand). Skill-level premiums on cybersecurity engineer postings: Kubernetes +$18K, Okta/identity +$18K, GCP +$16.7K, IaC +$16.4K, LLMs +$16K, Terraform +$15K. Splunk, Windows and Active Directory skills sit *below* baseline.

**AI impact.** Two separate effects, don't conflate them:
1. *AI as a threat to your job* — minimal at the engineering level, significant at the analyst level. AI eats alert triage, log summarisation, first-pass report writing, and rule tuning. It does not eat architecture decisions, blast-radius reasoning, cross-team negotiation, or accountability. The convergence you must respect: **the SOC analyst career ladder is being compressed; the security *engineering* ladder is not.** This is why the target role in this document is correct.
2. *AI as a new attack surface you get paid to secure* — this is the growth vector. AI agents are the fastest-growing new skill category on cybersecurity engineer postings, ahead of LLMs and genAI generally. AI/ML security salaries reach ~$180K with reported ~74% YoY niche growth. Most AI workloads run on cloud infrastructure, so cloud security engineers are the natural owners.

**Future trends.** (a) Identity is the new perimeter and non-human/workload identity is outgrowing human identity; (b) Zero Trust moved from slideware to procurement requirement; (c) guardrails-as-code replaces audit-and-nag; (d) post-quantum crypto migration becomes a real 2026–2030 workstream; (e) agentic AI and MCP security is an unclaimed specialism.

**Recommended specialisation paths** (pick one *after* Phase 7, not before):
- **Cloud Platform Security Engineer** — deepest AWS/Azure, IAM, guardrails. Widest job market.
- **DevSecOps / Platform Security** — CI/CD, supply chain, policy-as-code, Kubernetes. Highest salary premium per unit of effort.
- **Cloud Detection Engineering** — cloud-native threat detection and IR. Smaller market, low competition, sticky.
- **AI Infrastructure Security** — securing the training/inference/agent stack. Highest upside, highest noise, requires the others as a base.

---

# What Intermediate Cloud Security Engineers Actually Do

**Daily responsibilities**
- Review and approve/reject infrastructure changes (Terraform PRs, IAM policy diffs, new VPC peering, public-facing resources).
- Triage findings from CSPM/CNAPP tooling — and, critically, *suppress the noise* and fix the root cause in a module rather than ticketing 400 instances.
- Write and maintain guardrails: SCPs, Azure Policy, OPA/Kyverno rules, Checkov/tfsec policies.
- Investigate alerts that involve cloud control-plane activity (unusual AssumeRole, key exfil, new IAM user, disabled logging).
- Answer engineers' questions in Slack. Realistically 20–40% of the job is consultation, not building.
- Break-glass, access reviews, secret rotation, certificate expiry, exception tracking.

**Common projects**
- Baselining a multi-account AWS org: Control Tower / landing zone, SCP baseline, centralised CloudTrail + Config, GuardDuty org-wide.
- Killing long-lived IAM users and static keys; migrating to OIDC federation for CI/CD.
- Rolling out a Kubernetes admission control policy set and getting teams to comply without stopping deploys.
- Standing up secret management (Vault / Secrets Manager / Key Vault) and removing secrets from repos and pipelines.
- Building detections for the top 20 cloud attack techniques and proving coverage.
- Securing an AI workload: model artefact provenance, inference endpoint authn/authz, data boundaries for RAG stores.

**Collaboration**
- *Platform/DevOps*: your primary counterpart. You will be judged on whether they want to work with you.
- *Software engineering*: threat modelling, design review, pipeline friction complaints.
- *SOC/IR*: you supply log sources, context, and cloud-specific playbooks; they page you at 2am.
- *GRC/compliance*: you translate controls into enforced configuration and supply evidence.
- *Data/ML teams*: increasingly, the group with the worst hygiene and the most valuable data.

**Technical expectations**
- Read and write Terraform and YAML fluently; read Python/Go; write Python/Bash automation without help.
- Explain an IAM authorization decision end to end, including trust policies, permission boundaries, SCPs and resource policies.
- Debug networking (why can this pod not reach that endpoint) without escalating.
- Use the CLI/API as the default, not the console.
- Version-control everything you build.

**Business expectations**
- Frame risk in terms of blast radius and likelihood, not CVSS.
- Accept residual risk in writing and move on — engineers who can only say no do not get promoted.
- Estimate work, hit dates, and communicate slips early.
- Understand cost: a security control that triples log spend will be reverted.

---

# Market Analysis

## AWS Demand
- **Market demand:** Highest absolute volume. AWS holds ~28–31% of global cloud infrastructure spend (trackers vary: Synergy Q2 2026 reports AWS 28%, Azure 20%, Google Cloud 15% of a $143B quarter; other trackers show AWS 30–31%/Azure 24%). AWS appears in ~37.6% of cybersecurity engineer postings vs Azure ~30.8% and GCP ~21.9%. US job openings referencing AWS security cert content reported at ~12–15K vs ~8–11K Azure and ~3–5K GCP.
- **Future outlook:** Losing relative share (–2 points YoY) but growing in absolute dollars. Installed base means AWS security work is not going anywhere this decade.
- **Salary influence:** Baseline rather than a premium — it's assumed. Absence of AWS is a penalty; presence is not a bonus.
- **Recommended depth:** **Mastery.** This is your primary platform. Non-negotiable.

## Azure Demand
- **Market demand:** Strong #2 and dominant in specific verticals — financial services, government, healthcare, large regulated enterprise. Entra ID/identity work drives a large share of Azure security postings.
- **Future outlook:** Flat share, rising dollars. M365 + Entra gravity keeps enterprise demand stable and defensive.
- **Salary influence:** Neutral to positive; combined AWS+Azure is a genuine differentiator for mid-level roles.
- **Recommended depth:** **Working proficiency** (can secure a subscription, own Entra ID, read Azure Policy) — not mastery unless your target market is enterprise/regulated.

## GCP Demand
- **Market demand:** Smallest of the three by postings but the fastest-growing platform (record 15% share Q2 2026, ~+2 points YoY), concentrated in data-, AI- and engineering-led companies.
- **Future outlook:** Rising, tied directly to AI infrastructure spend.
- **Salary influence:** **Highest per-posting premium of the three** (~+$16.7K) precisely because supply is thin.
- **Recommended depth:** **Awareness → working proficiency later.** Learn GCP *third*, or second if you are targeting AI-infrastructure work.

## Multi-Cloud Demand
- **Market demand:** ~89% of enterprises report multi-cloud in 2026, but "multi-cloud security engineer" is rarely the hiring unit. Employers hire for one primary platform and expect competence in a second.
- **Future outlook:** Demand shifts toward *abstraction* skills — CNAPP, identity federation, unified policy — rather than three sets of console knowledge.
- **Salary influence:** Real but only at senior/architect level.
- **Recommended depth:** **Deep in one, competent in two, aware of three.** Do not pursue balanced tri-cloud knowledge; it produces shallow candidates.

## DevSecOps Demand
- **Market demand:** ~14.7% of cybersecurity engineer postings name DevSecOps explicitly; CI/CD appears in ~25.7%; automation in ~44.5% and Python in ~41%. ~74.8% of postings expect infrastructure operation alongside security work — that ratio is the clearest evidence of role convergence.
- **Future outlook:** Stops being a title and becomes a default expectation. Supply-chain security (SBOM, provenance, SLSA) is the growth edge.
- **Salary influence:** Cloud + DevSecOps combinations report ~20–35% uplift over standard DevOps roles.
- **Recommended depth:** **Mastery of the security-relevant subset.** You need pipeline security, not full SRE.

## Kubernetes Demand
- **Market demand:** ~17.9% of postings — a differentiator tier, not a common tier. Nearly every cloud-native and platform-security posting includes it.
- **Future outlook:** Stable-to-growing; managed K8s keeps growing while raw cluster ops shrinks. Runtime and admission control are the security-relevant survivors.
- **Salary influence:** **Highest single named premium (~+$18K).**
- **Recommended depth:** **Mastery of security surfaces** (RBAC, admission, network policy, runtime, secrets, supply chain). Awareness only for cluster installation/upgrade/etcd operations.

## AI Infrastructure Security Demand
- **Market demand:** Fastest-growing new category. AI agents lead new-skill growth on security engineer postings. AI security engineer comp reported at ~$153–188K average with top quartile ~$237K. Certain postings now list OWASP LLM Top 10 knowledge as a hard requirement.
- **Future outlook:** The single most likely place for a 2027–2030 seniority jump. Also the most hype-saturated — separate "securing AI systems" (real, paid) from "using AI to do security" (mostly vendor marketing).
- **Salary influence:** LLM-related skills ~+$16K today, likely rising.
- **Recommended depth:** **Working proficiency, added last.** It is a multiplier on cloud skills, not a substitute.

## Security Engineering Demand
- **Market demand:** The convergence is effectively complete. "Cloud Security Engineer," "Platform Security Engineer," "Product Security Engineer (Infra)" and "DevSecOps Engineer" job descriptions now overlap 60–80%. The dividing line in the market is no longer cloud-vs-security, it's *builder vs monitor*.
- **Future outlook:** Builders are safe from AI displacement and from title churn. Monitors are not.
- **Salary influence:** Engineering-titled roles consistently out-earn analyst-titled roles at equal experience.
- **Recommended depth:** **Mastery.** Everything in this roadmap is oriented to making you a builder.

---

# Hiring Manager Analysis

**What makes candidates stand out**
1. **Can debug, not just configure.** A candidate who walks through why an IAM call was denied — trust policy, boundary, SCP, resource policy, session tag — beats one who has memorised service lists.
2. **Evidence of shipped guardrails.** A repo with working SCPs, OPA policies, or a Terraform module with security defaults baked in is worth three certifications.
3. **Writes code.** Python or Go, not just YAML. Automation is named in ~44.5% of postings.
4. **Talks about blast radius and cost.** Shows you've worked with real constraints.
5. **Explains a time they said yes with conditions.** Demonstrates you can operate inside an engineering org.
6. **Can read someone else's Terraform and find the flaw.** Common live-interview exercise.

**Mistakes candidates make**
- Certification stacking with no artefacts. Four certs, zero repos, is a red flag in 2026, not a green one.
- Studying breadth across AWS+Azure+GCP simultaneously and mastering none.
- Treating cloud security as "run a scanner, file tickets." That job is being automated.
- Weak networking fundamentals. This is *the* most common failure point in technical screens — candidates who can't explain TLS handshake, DNS resolution path, or NAT behaviour get rejected regardless of cloud knowledge.
- Home-lab projects that are tutorials with the names changed. Hiring managers recognise the popular tutorials on sight.
- No opinion. Being asked "public subnet or private subnet for this?" and having no reasoning.
- Over-indexing on offensive/CTF skills for a defensive engineering role.

**Overhyped skills**
- Vendor-specific CNAPP/CSPM console expertise (Wiz, Prisma, Orca). Learn the *concepts*; the tools take two weeks and change employer to employer.
- CISSP for an intermediate engineer. Recognised, but management-oriented and does not reflect the work.
- Cloud pentesting as a primary identity. Small market, heavily saturated with applicants.
- "Prompt engineering" as a security skill.
- Breadth-first multi-cloud.
- SOAR playbook building as a differentiator — increasingly LLM-generated.

**Underrated skills**
- **Deep networking.** Consistently the strongest predictor of interview performance and consistently skipped.
- **Linux internals** — namespaces, cgroups, capabilities, systemd. Container security is Linux security with extra steps.
- **Writing.** Design docs, risk acceptances, postmortems. Mid-level engineers are promoted on written artefacts.
- **IAM policy evaluation logic** at the level of actual algorithm, not "least privilege" as a slogan.
- **Cost awareness** in logging and detection design.
- **Log schema knowledge** — knowing what CloudTrail actually records and what it doesn't.
- **Git fluency** beyond add/commit/push.

**Becoming mandatory**
- Terraform (read, write, review).
- CI/CD security and OIDC-based workload identity — static keys in pipelines are becoming an automatic fail.
- Kubernetes security surfaces for any cloud-native employer.
- IAM at depth on at least one platform.
- Python automation.
- Familiarity with securing AI workloads — moving from differentiator to baseline within ~18 months.
- Policy-as-code.

---

# Intermediate Cloud Security Roadmap

**Total realistic timeline: 11–14 months** at 15–20 hrs/week for someone with basic computer knowledge and no prior IT role. Compressed and extended variants are in the final section.

Depth key: **M** = mastery (can debug under pressure), **P** = working proficiency (can build and operate), **A** = awareness (can recognise and research).

---

# Phase 1
## Deep Networking Foundation — 6–8 weeks

## Objective
Reason about any packet, name resolution, or TLS failure without guessing.

## Why It Matters
Every cloud security control is a networking control wearing a costume. Security groups are stateful firewalls, VPC endpoints are DNS tricks, service meshes are proxies, and Kubernetes network policy is iptables. Candidates fail technical screens here more than anywhere else.

## Topics
OSI/TCP-IP model in practice · addressing and subnetting · routing · switching · DNS · TLS/PKI · HTTP · proxies and load balancers · VPNs · packet analysis.

## Microtopics
- **TCP/IP (M):** three-way handshake, states, RST vs FIN, MSS/MTU, retransmission, congestion, SYN flood mechanics, UDP tradeoffs, ephemeral ports, connection tracking.
- **DNS (M):** recursive vs iterative, record types (A/AAAA/CNAME/TXT/MX/SRV/NS/CAA), TTL and caching, split-horizon, DNS over TLS/HTTPS, DNSSEC (A), DNS exfiltration and tunnelling, DNS rebinding.
- **Routing (M):** longest-prefix match, static vs dynamic, default routes, route tables, asymmetric routing, BGP concepts and hijacking (A), NAT and PAT, CGNAT.
- **Switching (P):** MAC learning, VLANs, trunking, broadcast domains, ARP and ARP spoofing, STP (A).
- **VPN (P):** IPsec phases 1/2, IKEv2, tunnel vs transport, WireGuard, SSL VPN, split tunnelling risk, site-to-site vs client VPN.
- **TLS (M):** 1.2 vs 1.3 handshake differences, cipher suites, forward secrecy, certificate chains, SNI and ESNI, mTLS, pinning, OCSP/CRL, session resumption, common handshake failure causes.
- **Load balancing (P):** L4 vs L7, algorithms, health checks, TLS termination vs passthrough vs re-encryption, sticky sessions, X-Forwarded-For and spoofing.
- **Reverse proxies (P):** nginx/Envoy config, header manipulation, request smuggling basics, WAF placement, caching risks.
- **HTTP internals (M):** methods, status semantics, headers, cookies and attributes, CORS, HTTP/2 and /3, chunked encoding, keep-alive.

## Practical Labs
1. Capture and annotate a full TLS 1.3 handshake in Wireshark; repeat with 1.2 and diff them.
2. Build a 3-router topology in containerlab or GNS3; break routing deliberately and fix it.
3. Run your own recursive resolver (Unbound); trace resolution of a domain from root.
4. Build a CA with OpenSSL; issue, revoke, and validate certs; deliberately create chain failures and diagnose from the client error.
5. Put nginx in front of two backends; do TLS termination, then passthrough; capture both.
6. Set up WireGuard site-to-site between two VMs; observe pre/post encryption traffic.
7. Write a 60-line Python TCP client/server and watch the handshake you caused.
8. Debug five broken scenarios blind (MTU mismatch, missing return route, wrong SNI, expired intermediate, split-horizon DNS).

## Projects
- **Network Forensics Notebook:** a repo of 10 annotated pcaps, each with the failure, the evidence, and the fix.
- **Personal CA + mTLS demo:** two services authenticating with client certs, documented.

## Interview Questions
- Walk me through everything that happens when you type a URL and press enter.
- What changed between TLS 1.2 and 1.3 and why does it matter for inspection?
- A client gets an intermittent TLS error only from one region. How do you diagnose it?
- What's the difference between a stateful and stateless firewall, and which is a security group?
- How does an attacker exfiltrate over DNS, and how would you detect it?
- Why might lowering MTU fix a "connection hangs after handshake" bug?
- L4 vs L7 load balancer — what visibility do you lose with each?
- Explain asymmetric routing and why it breaks stateful inspection.

## Common Mistakes
Memorising the OSI model as trivia; skipping packet capture; learning subnetting only for exams; treating TLS as "the padlock."

## DOs
Capture traffic for every concept you learn · break things on purpose · keep a written debugging log · use `dig`, `tcpdump`, `curl -v`, `openssl s_client` daily.

## DON'Ts
Don't buy a CCNA-track course and disappear for four months · don't study wireless/enterprise switching in depth · don't memorise port numbers as a study activity.

## Industry Tools
Wireshark/tshark · tcpdump · dig/dog · curl · openssl · nmap · mtr/traceroute · iperf3 · nginx · Envoy · WireGuard · containerlab · GNS3.

## Completion Criteria
You can diagnose an unfamiliar connectivity failure from packet capture alone, and explain any TLS error message without searching.

---

# Phase 2
## Linux Mastery — 5–7 weeks

## Objective
Operate, harden, and forensically inspect a Linux system, and understand the kernel primitives containers are built from.

## Why It Matters
Cloud workloads are Linux. Container escape, privilege escalation, and runtime detection all live at the syscall/namespace/capability layer. Linux appears in ~16.8% of security engineer postings explicitly and is implicitly assumed in most others.

## Topics
Shell and text processing · filesystem and permissions · processes and signals · systemd · networking stack · package and boot · users/PAM/sudo · kernel security primitives · logging · scripting.

## Microtopics
- **Shell (M):** pipes, redirection, exit codes, process substitution, globbing, quoting rules, `set -euo pipefail`, `grep`/`awk`/`sed`/`jq`/`xargs`/`find`.
- **Permissions (M):** ugo/rwx, setuid/setgid/sticky, umask, ACLs, attributes (`chattr`), and why setuid binaries matter for privesc.
- **Processes (M):** fork/exec, PID namespaces, `/proc` inspection, signals, zombie/orphan, `lsof`, `strace`, `ss`, cgroup accounting.
- **systemd (P):** units, targets, timers vs cron, journald, sandboxing directives (`ProtectSystem`, `NoNewPrivileges`, `PrivateTmp`, `CapabilityBoundingSet`).
- **Kernel security (M for containers):** namespaces (pid, net, mnt, user, uts, ipc), cgroups v2, capabilities (CAP_SYS_ADMIN, CAP_NET_RAW, etc.), seccomp profiles, AppArmor/SELinux (P), eBPF concepts (A→P).
- **Identity (P):** PAM stack, sudoers syntax and its footguns, SSH server hardening, key vs certificate auth, `authorized_keys` options.
- **Storage/boot (A–P):** LUKS, LVM, mount options (`nodev,nosuid,noexec`), initramfs, bootloader, immutable/OS-image distros.
- **Logging (M):** journald vs rsyslog, auditd rules, log shipping, what each source does and doesn't record.
- **Scripting (M):** Bash for glue, Python for anything over ~40 lines.

## Practical Exercises / Real-World Admin Tasks
1. Build a minimal server from ISO; harden it against a CIS benchmark manually, then automate with Ansible.
2. Write auditd rules for execve, file writes to `/etc`, and use of setuid binaries; generate and find the events.
3. Create a seccomp profile for a small binary; break it; read the resulting error.
4. Manually construct a container with `unshare`, `chroot`, and cgroups — no Docker.
5. Do a privilege-escalation walkthrough on a deliberately weak VM, then write the remediation.
6. Set up centralised logging from three hosts to one collector.
7. Write a Python script that inventories users, sudo rights, listening ports and setuid binaries across hosts via SSH and outputs JSON.
8. Diagnose a "disk full but `df` and `du` disagree" scenario.

## Projects
- **Hardening toolkit:** Ansible role + verification script + written rationale per control (not a copy of CIS).
- **Manual container from scratch:** documented, with a short write-up of which namespace provides which isolation property.

## Interview Questions
- What actually isolates a container from the host, and what doesn't?
- Which Linux capability would you never grant a container, and why?
- How would you detect a reverse shell on a host using only native tooling?
- Explain setuid and how it's abused.
- What's the difference between cgroups and namespaces?
- Where would you look first on a compromised host?

## Common Mistakes
Learning distro trivia instead of kernel primitives; never using `strace`; skipping auditd; using `sudo` without understanding sudoers parsing.

## DOs
Run a persistent Linux VM/daily driver · automate everything you do twice · read man pages first.

## DON'Ts
Don't spend time on desktop Linux, LFCS-level printer/X11 topics, or distro wars · don't skip `/proc`.

## Industry Tools
bash/zsh · systemd · auditd · strace/ltrace · ss/lsof · Ansible · osquery · Falco (preview) · Lynis · jq · tmux.

## Completion Criteria
You can build a hardened host from scratch, explain container isolation in kernel terms, and triage a suspicious process with native tools only.

---

# Phase 3
## Security Engineering Foundations — 6–8 weeks

## Objective
Own the conceptual core — identity, cryptography, threat modelling, detection — so cloud services become instances of patterns you already understand.

## Why It Matters
Cloud services change names every two years; authorization logic, trust boundaries and key hierarchies do not. This phase is what separates an engineer from a console operator.

## Topics
Threat modelling · IAM theory · PKI and applied crypto · authentication protocols · detection and logging theory · secure design patterns · risk communication.

## Microtopics
- **Threat modelling (M):** STRIDE, attack trees, trust boundaries, DFDs, abuse cases, MITRE ATT&CK (Cloud matrix specifically), assumption documentation, LINDDUN (A).
- **IAM (M):** AuthN vs AuthZ, RBAC/ABAC/ReBAC, policy evaluation order, deny-by-default, least privilege vs least friction, privilege escalation paths, separation of duties, JIT access, service/workload identity, non-human identity lifecycle.
- **Protocols (M):** OAuth 2.0 grant types and what each is for, OIDC ID tokens vs access tokens, JWT structure, signature validation and the `alg:none` class of bugs, SAML assertions and signature wrapping, SCIM (A), Kerberos (A), mTLS as identity, token lifetime tradeoffs.
- **PKI (M):** CA hierarchies, CSRs, X.509 fields and extensions, key usage, revocation, cert lifecycle automation (ACME), private CA design, key ceremony concepts (A).
- **Crypto (P):** symmetric vs asymmetric, AES-GCM and nonce reuse, key wrapping, envelope encryption, KDFs, password hashing (argon2/bcrypt), HMAC, signing vs encrypting, randomness, post-quantum migration landscape (A).
- **Detection (P→M in Phase 8):** telemetry sources, signal vs noise, detection-as-code, true/false positive economics, Pyramid of Pain, alert fatigue, MITRE mapping.
- **Logging/monitoring (M):** log vs metric vs trace, retention vs cost, tamper-evidence, centralisation, time synchronisation, what makes a log source forensically useful.
- **Secure design (M):** defence in depth, fail-closed vs fail-open, blast radius, secure defaults, tenant isolation, secrets lifecycle.

## Practical Labs
1. Threat model a three-tier web app end to end; produce a DFD, STRIDE table, and prioritised mitigations.
2. Stand up Keycloak; implement authorization code + PKCE; capture and decode the tokens; then deliberately break signature validation and exploit it.
3. Build a two-tier private CA with automated issuance; rotate the intermediate without downtime.
4. Implement envelope encryption manually in Python (data key + wrapping key), then compare to a managed KMS.
5. Ship logs from three sources into one store; write three detections; measure your false-positive rate over a week.
6. Map ten MITRE ATT&CK cloud techniques to the specific log events that would reveal them.

## Projects
- **Threat model portfolio:** three models of real open-source architectures, with written mitigation designs.
- **Identity lab:** OIDC-secured app with role-based authorization and a documented token-theft scenario.

## Interview Questions
- Walk me through an OAuth authorization code flow and where PKCE fits.
- What's in a JWT and how do you validate one correctly?
- Difference between RBAC and ABAC — when would you choose each?
- Explain envelope encryption and why cloud providers use it.
- How do you threat model a system you've never seen, in 30 minutes?
- What makes a detection good? How do you know a detection is bad?
- Your CA's intermediate key is suspected compromised. What happens next?

## Common Mistakes
Learning crypto algorithms rather than crypto *systems*; treating threat modelling as a document exercise; memorising ATT&CK IDs.

## DOs
Write everything down in design-doc format · always ask "what's the trust boundary" · practise explaining to a non-security engineer.

## DON'Ts
Don't implement your own crypto primitives · don't study compliance frameworks in depth yet · don't learn ATT&CK enterprise matrix exhaustively — cloud matrix only.

## Industry Tools
Keycloak · OWASP Threat Dragon / IriusRisk (A) · OpenSSL · step-ca · Vault · Sigma · Elastic/OpenSearch · MITRE ATT&CK Navigator.

## Completion Criteria
You can threat model an unfamiliar system live, explain any modern auth flow from memory, and design a key hierarchy.

---

# Phase 4
## AWS Mastery — 10–12 weeks

## Objective
Own AWS security at production depth: multi-account design, IAM at the evaluation-logic level, and detection across the org.

## Why It Matters
Largest market, most transferable mental model, and the platform most interview scenarios assume.

## Topics + Microtopics

**IAM (M)** — the single highest-leverage topic in this document.
- Policy types: identity, resource, permission boundary, SCP, session policy, RCP; the full evaluation logic and precedence order.
- Principals, ARNs, condition keys (`aws:PrincipalOrgID`, `aws:SourceIp`, `aws:SourceArn`, `aws:ViaAWSService`, `aws:PrincipalTag`), NotAction/NotResource traps.
- `sts:AssumeRole` trust policies, external ID and the confused-deputy problem, role chaining, session tags, ABAC.
- IAM Roles Anywhere, OIDC federation for GitHub Actions/EKS (IRSA / Pod Identity), Identity Center (SSO) and permission sets.
- Privilege escalation paths: `iam:PassRole`, `iam:CreatePolicyVersion`, `lambda:UpdateFunctionCode`, `ec2:RunInstances` + PassRole, `cloudformation` roles.
- Access Analyzer (external + unused access), Access Advisor, policy simulation, credential reports.

**VPC (M)** — CIDR design, subnets, route tables, IGW/NAT/egress-only, security groups vs NACLs (stateful vs stateless), VPC endpoints (gateway vs interface) and endpoint policies, PrivateLink, peering vs Transit Gateway, VPC Flow Logs fields and limitations, DNS resolution and Route 53 Resolver query logging, Network Firewall, egress control patterns.

**EC2 (P)** — IMDSv1 vs IMDSv2 and SSRF-to-credential chains, instance profiles, AMI hygiene and golden images, EBS encryption and snapshot sharing risks, SSM Session Manager as SSH replacement, Nitro isolation (A), patching via Patch Manager.

**S3 (M)** — bucket vs object ownership, ACLs (and why they're legacy), bucket policies, Block Public Access at account and bucket level, presigned URLs and their abuse, SSE-S3/SSE-KMS/SSE-C/DSSE, bucket keys, replication and its IAM implications, versioning + MFA delete, Object Lock, access logs vs CloudTrail data events, VPC endpoint policy enforcement.

**KMS (M)** — CMK vs AWS-managed vs owned, key policies (and why they override IAM), grants, encryption context, envelope encryption in practice, multi-region keys, external key store (A), rotation semantics, cross-account key use, deletion windows.

**CloudTrail (M)** — management vs data vs Insights events, organisation trails, log file integrity validation, delivery latency realities, what is *not* logged, CloudTrail Lake, per-service event naming.

**CloudWatch (P)** — Logs, log groups, metric filters, Logs Insights query language, alarms, EventBridge rules for security automation, subscription filters to a central account.

**GuardDuty (P)** — finding types worth alerting on vs not, Malware Protection, EKS/RDS/Lambda protection plans, org-wide delegated administration, cost behaviour, suppression rules.

**Security Hub (P)** — standards (CIS, FSBP, PCI), ASFF schema, aggregation regions, automation rules, integration into ticketing; and its limits as a source of truth.

**Organizations + SCPs (M)** — OU design, SCP evaluation with IAM, deny-list vs allow-list strategy, Control Tower and landing zones, delegated administration, RCPs, common baseline SCPs (deny root, deny CloudTrail disable, region restriction, deny IMDSv1, require encryption).

**Also:** Config + conformance packs (P), Macie (A), Inspector (P), Secrets Manager vs Parameter Store (P), WAF/Shield (P), ECR (P), Lambda security (P), Detective (A), Backup + immutability (P).

## Hands-On Labs
1. Build a 4-account Organization (management, security, log archive, workload) with Control Tower or Terraform from scratch.
2. Implement and test a 10-SCP baseline; prove each one denies what you expect using the policy simulator and real API calls.
3. Deliberately create three IAM privilege escalation paths, then detect and remediate them.
4. Exploit an SSRF to steal IMDSv1 credentials in your own lab; then prove IMDSv2 blocks it; then write the detection.
5. Build cross-account centralised logging: org CloudTrail + Config + VPC Flow Logs into a locked log-archive account with Object Lock.
6. Configure S3 so a bucket is reachable *only* through a VPC endpoint from one VPC, and prove it.
7. Encrypt with a customer-managed KMS key; then revoke the key policy and observe every failure mode.
8. Enable GuardDuty org-wide; generate five finding types intentionally; route them through EventBridge to auto-remediation Lambdas.
9. Run Prowler and ScoutSuite; triage the output down to a defensible top-10 and fix them in Terraform, not the console.

## Real-World Scenarios
- A developer needs cross-account S3 access; design it three ways and defend your choice.
- Production is down because an SCP you shipped blocked a service. Write the postmortem.
- An access key was found in a public repo. Walk the full response.
- Finance says CloudTrail data events tripled the bill. Reduce cost without losing detection coverage.

## Interview Questions
- Explain AWS policy evaluation when an SCP, identity policy, permission boundary and resource policy all apply.
- Why is a KMS key policy special?
- What's the difference between a security group and a NACL, and when does that difference matter?
- How does IMDSv2 defeat SSRF?
- What does CloudTrail *not* log?
- How would you design egress filtering for 200 accounts?
- What is `iam:PassRole` and why is it dangerous?

## Common Mistakes
Learning AWS through the console only · using `*` in policies "temporarily" · confusing Security Hub findings with actual risk · treating GuardDuty as a SIEM · skipping Organizations because the free tier makes it awkward.

## DOs
Build everything in Terraform · use the CLI/API · keep a personal account with a hard budget alarm · write down every service's failure mode.

## DON'Ts
Don't chase service breadth (250+ services is a trap) · don't study for a cert before you've broken things · don't skip IAM depth to reach "exciting" services.

## Industry Tools
Terraform · AWS CLI/CloudShell · Prowler · ScoutSuite · CloudMapper/cartography · Pacu (lab only) · Steampipe · policy_sentry · IAM Access Analyzer · Cloud Custodian.

## Completion Criteria
You can design and build a secured multi-account landing zone from an empty org, in code, and explain every control's failure mode.

---

# Phase 5
## Second Platform: Azure (chosen) — 6–8 weeks

## Research-Based Justification
**Learn Azure second, GCP third — unless you are deliberately targeting AI-infrastructure work.**

Evidence:
- **Posting volume:** Azure appears in ~30.8% of cybersecurity engineer postings vs GCP ~21.9%. Azure-security-cert-aligned US openings ~8–11K vs GCP ~3–5K.
- **Share:** Azure holds ~20–24% of cloud infrastructure spend vs GCP ~13–15%, and Azure's share is stable while AWS's declines.
- **Vertical concentration:** Azure dominates financial services, government, healthcare and large regulated enterprise — precisely the sectors that hire the most security headcount per dollar of infrastructure.
- **Identity gravity:** Entra ID is the identity plane for most enterprises regardless of where their compute runs. Identity skills (Okta/Entra) carry a ~+$18K premium and are the most transferable thing in this phase.
- **Counter-argument, honestly stated:** GCP carries the higher *salary premium* (~+$16.7K) because supply is thinner, and it's growing fastest (record 15% share, +2 points YoY) on the back of AI workloads. If your target is AI infrastructure security at an engineering-led company, invert the order.

## Objective
Secure an Azure subscription end to end and own Entra ID, with enough transfer to reason about GCP later.

## Topics / Microtopics
- **Entra ID (M):** tenants, users, groups, service principals vs managed identities, app registrations and consent, Conditional Access design, PIM and JIT roles, Access Reviews, authentication methods and phishing-resistant MFA, token lifetimes, Entra ID Protection risk signals, cross-tenant access settings, legacy auth blocking, B2B/B2C (A).
- **RBAC + governance (M):** management groups, subscriptions, resource groups, role definitions and assignments, deny assignments, Azure Policy (audit/deny/deployIfNotExists), initiatives, Blueprints successors, resource locks, tagging enforcement.
- **Networking (P):** VNets, NSGs vs ASGs, UDRs, Azure Firewall, Private Link and Private Endpoints, Service Endpoints, Bastion, hub-and-spoke and Virtual WAN, DDoS Protection.
- **Data/keys (P):** Key Vault (access policies vs RBAC), managed HSM, Storage account security (SAS tokens and their abuse, public access, firewall rules), Disk Encryption, Defender for Storage.
- **Detection (P):** Microsoft Defender for Cloud (CSPM + workload plans), Microsoft Sentinel, Azure Monitor + Log Analytics, diagnostic settings (the #1 forgotten control), KQL, Activity Log vs resource logs vs Entra sign-in/audit logs.
- **Compute (P):** managed identities on VMs/App Service/AKS, Defender for Containers, App Service networking.
- **GCP (A, ~1 week reading):** project/folder/org hierarchy, IAM inheritance and the primitive-roles problem, service accounts and impersonation, Org Policy constraints, VPC Service Controls (the concept worth knowing), Cloud Audit Logs tiers, Security Command Center.

## Roadmap for This Phase
Weeks 1–3 Entra ID and RBAC → Weeks 4–5 networking and Key Vault → Weeks 6–7 Defender for Cloud, diagnostic settings, Sentinel + KQL → Week 8 GCP concept sweep and a written AWS/Azure/GCP mapping table.

## Practical Labs
1. Build a management-group hierarchy with Azure Policy initiatives enforcing encryption, region, and public-access restrictions.
2. Design and test a Conditional Access policy set; break yourself out of the tenant, then recover via break-glass account.
3. Enable PIM for a privileged role, with approval and justification; audit the trail.
4. Turn on diagnostic settings across a subscription via policy `deployIfNotExists`; prove logs land in Log Analytics.
5. Write five KQL detections over Entra sign-in logs (impossible travel, legacy auth, consent grant, new admin, MFA fatigue).
6. Abuse a permissive SAS token in your lab, then eliminate the pattern with user delegation SAS + Private Endpoint.

## Projects
- **Azure landing-zone baseline in Terraform** with policy set and written control rationale.
- **Cloud control mapping document:** 40 controls mapped across AWS/Azure/GCP with equivalence notes and the places they genuinely differ. This artefact interviews extremely well.

## Interview Questions
- Compare AWS SCPs to Azure Policy — what can each do that the other can't?
- Managed identity vs service principal vs app registration?
- How does Conditional Access differ from MFA-on-by-default?
- What breaks if diagnostic settings aren't configured?
- How does GCP IAM inheritance differ from AWS?

## Common Mistakes
Assuming Azure RBAC works like AWS IAM · ignoring Entra because it "feels like IT" · forgetting diagnostic settings · using Key Vault access policies instead of RBAC.

## DOs
Use an Azure free/dev tenant · learn KQL properly (it's reusable across Sentinel, Defender, Log Analytics) · write the comparison table as you go.

## DON'Ts
Don't try to match your AWS depth here · don't learn M365 admin, Intune, or Windows Server administration · don't start GCP hands-on yet.

## Industry Tools
Azure CLI/PowerShell · Terraform AzureRM · Microsoft Sentinel · Defender for Cloud · ScoutSuite/Prowler (Azure support) · Azure Policy · KQL.

## Completion Criteria
You can secure a greenfield Azure subscription in code, own Entra ID configuration, and explain the AWS↔Azure control mapping without notes.

---

# Phase 6
## Containers and Kubernetes Security — 7–9 weeks

## Objective
Secure a Kubernetes platform: build, admit, run, network, and secrets.

## Why It Matters
Highest named salary premium (~+$18K) and the defining skill of cloud-native security teams. Also where Phase 2 pays off.

## Topics / Microtopics
- **Docker/OCI (M):** image layers and caching, Dockerfile security (non-root user, pinned digests, multi-stage), build context leakage, registry authn, image signing (Cosign/Sigstore), SBOM generation (Syft) and scanning (Grype/Trivy), distroless, `docker.sock` exposure, rootless mode, capabilities and `--privileged`.
- **Kubernetes architecture (P):** API server, etcd, scheduler, controller manager, kubelet, CNI/CRI/CSI, managed vs self-managed control planes.
- **K8s AuthN/AuthZ (M):** certificates, OIDC integration, ServiceAccounts and projected tokens, RBAC roles vs cluster roles, aggregation, the `escalate`/`bind`/`impersonate` verbs, cloud IAM integration (IRSA/EKS Pod Identity, Workload Identity, Entra Workload ID).
- **Pod security (M):** Pod Security Standards (privileged/baseline/restricted), Pod Security Admission, securityContext fields, seccomp/AppArmor profiles, hostPath/hostNetwork/hostPID dangers, container escape paths.
- **Admission control (M):** validating vs mutating webhooks, OPA Gatekeeper, Kyverno, policy authoring and testing, failure modes (`failurePolicy` and the day you take the cluster down), image provenance verification at admission.
- **Network policy (M):** default-deny ingress and egress, namespace and pod selectors, CNI differences (Calico/Cilium), DNS policy gotchas, service mesh mTLS (Istio/Linkerd, P), east-west vs north-south.
- **Runtime security (P→M):** Falco rules, eBPF-based detection (Tetragon/Cilium), Kubernetes audit log policy and what to log, drift detection, kill-vs-alert decisions.
- **Secrets (M):** why base64 etcd Secrets aren't secret, encryption at rest with KMS provider, External Secrets Operator, Vault Agent/CSI, Sealed Secrets, short-lived credentials over static.
- **Supply chain (P):** admission-time signature verification, SLSA levels, provenance attestations, base image lifecycle.
- **Multi-tenancy (P):** namespace isolation limits, resource quotas, node pools, vCluster/Kata (A).

## Practical Labs
1. Stand up kind/k3s; then deliberately escape a container three ways (hostPath, privileged, docker.sock) and write each remediation.
2. Write a least-privilege RBAC set for three personas; audit with `kubectl-who-can` and `rbac-tool`.
3. Enforce restricted Pod Security Admission cluster-wide; fix the workloads it breaks rather than exempting them.
4. Author 8 Kyverno or Gatekeeper policies with unit tests (require signed images, deny latest tag, deny hostPath, require resource limits, require non-root, enforce labels, restrict registries, require network policy).
5. Implement default-deny network policy in a namespace with a 3-service app; restore connectivity deliberately.
6. Deploy Falco; trigger 6 rules; tune two of them to eliminate noise; write the rule diff.
7. Sign images with Cosign, verify at admission, then try to deploy an unsigned image.
8. Enable etcd encryption with a cloud KMS provider and prove secret plaintext is gone.
9. Configure Kubernetes audit policy and ship the logs; detect `exec` into a production pod.

## Projects
- **Hardened cluster platform repo:** Terraform + Helm + policy library + Falco rules + network policies, with a README explaining each decision and its cost.
- **Container escape catalogue:** documented escapes with detection and prevention for each.

## Interview Questions
- How does a pod get cloud credentials, and what's wrong with node-level IAM roles?
- What exactly does `privileged: true` grant?
- Kyverno vs Gatekeeper — trade-offs?
- Why is a Kubernetes Secret not secret, and what do you do about it?
- Your admission webhook is down. What happens to the cluster, and how did you configure it to behave that way?
- How do you implement default-deny egress without breaking DNS?
- What's in the audit log that's not in the application logs?

## Common Mistakes
Learning K8s ops instead of K8s security surfaces · applying policies in enforce mode on day one · granting cluster-admin for convenience · ignoring the audit log.

## DOs
Run policies in audit mode first · treat RBAC like cloud IAM · always test the failure mode of admission webhooks.

## DON'Ts
Don't pursue CKA-level cluster administration depth · don't learn Helm charting beyond consumption · don't buy a CNAPP course.

## Industry Tools
kubectl · kind/k3s/minikube · Kyverno · OPA/Gatekeeper · Falco · Tetragon/Cilium · Trivy · Grype/Syft · Cosign/Sigstore · kube-bench · kubescape · External Secrets Operator · Vault · Calico.

## Completion Criteria
You can take an unhardened cluster to a policy-enforced, default-deny, signed-image platform in code, without breaking the workloads.

---

# Phase 7
## Infrastructure as Code and DevSecOps — 6–8 weeks

## Objective
Make secure the default path by embedding controls into code, pipelines and review.

## Why It Matters
IaC carries a ~+$16.4K premium, Terraform ~+$15K, and ~74.8% of postings expect infrastructure operation. This phase is also what converts you from "reviewer" to "builder" in the hiring manager's mind.

## Topics / Microtopics
- **Git (M):** branching models, rebase vs merge, `.gitignore` discipline, signed commits, hooks, history rewriting to purge secrets (and why the secret is still compromised), CODEOWNERS, branch protection, monorepo vs polyrepo.
- **Terraform (M):** HCL, providers, state and state security (remote backend, encryption, locking, and the fact that state contains secrets), modules and versioning, workspaces, `plan` vs `apply`, drift, `import`, `moved`, sentinel/OPA integration, provider authentication without static keys, `terraform-docs`, testing (Terratest, `terraform test`), writing a *secure-by-default module* others consume.
- **GitHub Actions (M):** workflow syntax, `pull_request` vs `pull_request_target` (a live exploit class), OIDC to cloud (no static keys), permissions scoping of `GITHUB_TOKEN`, third-party action pinning by SHA, secrets and environment protection rules, self-hosted runner risks, artefact poisoning, reusable workflows.
- **CI/CD security (M):** the build system as a privileged identity, SLSA levels, provenance and attestation, dependency confusion, typosquatting, lockfiles, artifact signing, ephemeral runners, least-privilege deploy roles, separation of build and deploy.
- **Policy as code (M):** OPA/Rego basics, Conftest, Checkov/tfsec/Trivy-IaC, custom policy authoring, policy testing, guardrail-vs-gate decisions, exception workflow design.
- **Scanning integration (P):** SAST, SCA, secret scanning (Gitleaks/TruffleHog), container scanning, DAST (A) — and the discipline of *blocking on few things and reporting on many*.
- **Automation (M):** Python for remediation, event-driven security (EventBridge/Functions), Cloud Custodian, ChatOps.

## Practical Projects
1. **Secure Terraform module library:** VPC, S3, IAM role, RDS, EKS modules with security defaults, versioned, documented, published.
2. **Full pipeline:** PR → Checkov + Gitleaks + Trivy + `terraform plan` + policy gate → OIDC-authenticated apply to a sandbox account. Zero static credentials anywhere.
3. **Custom policy pack:** 15 Rego/Checkov policies with tests and documented rationale.
4. **Supply chain demo:** sign artefacts, generate SBOM and provenance, verify at deploy, then demonstrate a blocked tampered artefact.
5. **Exploit and fix:** build a vulnerable `pull_request_target` workflow, exfiltrate a secret in your own repo, fix it, write it up.

## Interview Questions
- Where do secrets live in Terraform state and what do you do about it?
- How do you give a CI pipeline cloud access without long-lived keys?
- What's the difference between `pull_request` and `pull_request_target` and why does it matter?
- Which scanners block the build and which only report? Justify.
- How do you handle a policy exception request from a team shipping tomorrow?
- What is SLSA and which level is realistic for a mid-size company?

## Common Mistakes
Blocking builds on every finding (teams route around you within a month) · storing state in a bucket with no encryption or locking · unpinned third-party actions · writing policies without tests.

## DOs
Ship guardrails as modules, not tickets · measure and reduce false positives · pin everything by digest · make the secure path the easy path.

## DON'Ts
Don't learn every IaC tool — Terraform first, Pulumi/CDK awareness only · don't build a custom scanner · don't gate on secrets scanning without a rotation runbook.

## Industry Tools
Terraform/OpenTofu · Git + GitHub Actions (GitLab CI awareness) · Checkov · tfsec/Trivy · OPA/Conftest · Gitleaks/TruffleHog · Cosign · Syft/Grype · Renovate/Dependabot · Cloud Custodian · pre-commit · Atlantis.

## Completion Criteria
Another engineer can consume your modules and pipeline and ship a compliant environment without talking to you.

---

# Phase 8
## Cloud Detection Engineering — 5–7 weeks

## Objective
Detect cloud-native attacks with tested, version-controlled detections and run an incident end to end.

## Why It Matters
Incident response appears in ~31.4% of postings and SIEM in ~25%. This is also the skill that survives the AI-driven compression of analyst work, because writing detections is engineering while triaging them is not.

## Topics / Microtopics
- **Log sources (M):** CloudTrail (management/data/Insights), VPC Flow Logs, Route 53 resolver logs, S3 access logs, ALB logs, EKS audit logs, Entra sign-in/audit logs, Azure Activity + diagnostic logs, GCP Cloud Audit Logs tiers — with the gaps in each.
- **Pipelines (P):** collection, normalisation (OCSF/ECS), enrichment, routing, storage tiering, cost control, retention policy vs forensic need.
- **SIEM (P):** Splunk SPL or Sentinel KQL (pick one, learn deeply), Elastic/OpenSearch, Athena/CloudTrail Lake for cheap cloud-native querying, data models.
- **Detection rules (M):** Sigma as portable format, detection-as-code in Git with CI testing, tuning methodology, alert enrichment and context, threshold vs behavioural vs anomaly, severity design, the cost of every false positive.
- **Cloud attack techniques to detect (M):** credential theft via IMDS/SSRF, access key abuse from a new ASN, role chaining, persistence via new IAM user/role or Lambda, disabling CloudTrail/GuardDuty, S3 exfiltration, KMS key deletion, cross-account snapshot sharing, OAuth consent grant abuse, Entra privilege escalation, K8s `exec` and service-account token theft, ransomware on object storage.
- **Incident response (M):** cloud-specific IR lifecycle, evidence acquisition (snapshots, memory, logs), containment without destroying evidence, credential revocation ordering, scoping via CloudTrail, blast-radius determination, communications, postmortem writing.
- **Threat hunting (P):** hypothesis-driven hunts, baselining normal in a cloud account, frequency analysis, ATT&CK cloud coverage mapping.
- **Purple teaming (P):** Stratus Red Team, Atomic Red Team, CloudGoat for generating real telemetry.

## Hands-On Projects
1. **Detection-as-code repo:** 25+ Sigma rules with test data, CI validation, and ATT&CK cloud coverage map. *This is one of the strongest portfolio artefacts available at intermediate level.*
2. **Detection lab:** run Stratus Red Team against your own AWS org, capture telemetry, write detections for every technique, measure detection latency.
3. **Full IR exercise:** simulate leaked-key → enumeration → persistence → exfiltration; respond, scope, contain, and publish a real postmortem.
4. **Log cost optimisation:** cut logging spend 40% in your lab while documenting exactly what detection coverage you lost.
5. **Hunt write-ups:** three hypothesis-driven hunts with negative results documented honestly.

## Interview Questions
- Walk me through responding to a leaked AWS access key found on GitHub.
- What CloudTrail events indicate an attacker establishing persistence?
- How do you detect data exfiltration from S3, and what are the false positives?
- Your GuardDuty alert says "UnauthorizedAccess:IAMUser/MaliciousIPCaller." Now what?
- How do you know your detection coverage is adequate?
- How do you acquire forensic evidence from a running EC2 instance?
- Detection X fires 200 times a week and is always a false positive. What do you do?

## Common Mistakes
Writing detections without generating real telemetry to test against · copying public rulesets and calling it coverage · ignoring cost · conflating a finding with an incident · destroying evidence during containment.

## DOs
Version control every detection · document the false-positive profile of each rule · practise the write-up, not just the fix.

## DON'Ts
Don't learn three SIEMs · don't build a home SOC with 40 tools · don't chase SOAR playbook volume.

## Industry Tools
Sigma · Splunk or Sentinel (+KQL) · Elastic/OpenSearch · Athena / CloudTrail Lake · Stratus Red Team · CloudGoat · flaws.cloud · Atomic Red Team · GuardDuty/Defender/SCC · Falco · Velociraptor (A) · Grafana.

## Completion Criteria
You can build a tested detection for an unfamiliar cloud technique in under an hour and run an incident end to end with a written postmortem.

---

# Phase 9
## Advanced Cloud Security — 6–8 weeks

## Objective
Operate at design level: review architectures, model threats across clouds, and make defensible trade-offs.

## Why It Matters
This is the boundary between mid-level and senior, and it's what determines whether you're consulted before a system is built or after.

## Topics / Microtopics
- **Multi-cloud (P):** identity federation across providers, workload identity federation, unified policy and CNAPP concepts, control equivalence and where it genuinely breaks, data residency, egress cost as a security constraint, provider-independent abstractions vs lowest-common-denominator security.
- **Zero Trust (M):** NIST SP 800-207 components, policy enforcement/decision points, device and workload identity, microsegmentation approaches and their real cost, continuous verification, BeyondCorp-style access proxies, service mesh mTLS, the honest limits and failure modes.
- **Cloud threat modelling (M):** per-service trust boundaries, shared responsibility applied concretely per service model, control-plane vs data-plane threats, tenant isolation, third-party/SaaS integration risk, supply chain, cross-account trust graphs, attack-path analysis.
- **Architecture reviews (M):** review methodology and checklists, blast-radius analysis, failure-mode reasoning, cost-of-control analysis, compensating controls, documenting residual risk, negotiating with engineering teams.
- **Security design reviews (M):** intake process design, sizing the review to the risk, the design-doc format, producing decisions rather than findings, tracking exceptions to expiry.
- **Resilience (P):** backup immutability, ransomware recovery for cloud, key-loss scenarios, region failure, break-glass procedures and testing them.
- **Emerging (A):** post-quantum crypto migration and crypto-agility, confidential computing, sovereign cloud requirements.

## Practical Projects
1. **Architecture review portfolio:** review three real open-source reference architectures; publish findings, risk ratings and recommended designs.
2. **Zero Trust implementation:** identity-aware proxy + workload mTLS + device signal in a lab; document what it actually cost and what it didn't solve.
3. **Attack-path analysis:** build a cross-account trust graph with Cartography, identify the three shortest paths to your crown jewels, remediate and re-measure.
4. **Multi-cloud identity federation:** a workload in AWS authenticating to Azure and GCP resources with no static credentials.
5. **Security design doc set:** four production-grade design docs (log pipeline, secrets platform, egress control, break-glass) written in the format a real team would review.

## Interview Questions
- Design a security architecture for a company moving 200 microservices to EKS. Where do you start?
- What does shared responsibility actually mean for RDS vs EC2 vs Lambda?
- Zero Trust is often oversold — what does it not solve?
- How do you decide whether a control is worth its cost?
- Walk me through an architecture review you did and a recommendation you were overruled on.
- How would you approach securing a multi-cloud estate with one small team?

## Common Mistakes
Producing findings lists instead of decisions · designing controls no team will adopt · using Zero Trust as a slogan · ignoring operational cost.

## DOs
Write design docs · quantify blast radius · always offer an achievable alternative to "no."

## DON'Ts
Don't drift into pure GRC · don't build architectures you've never operated · don't treat vendor reference architectures as ground truth.

## Industry Tools
Cartography/CloudMapper · Steampipe · Wiz/Orca/Prisma (A only) · Terraform · Istio/Linkerd · Teleport/Pomerium · draw.io/Structurizr · NIST 800-207, CSA CCM, AWS/Azure Well-Architected security pillars.

## Completion Criteria
You can run a design review for an unfamiliar system, produce a decision document, and defend the trade-offs to both engineering and leadership.

---

# AI and Cloud Security

## Which AI topics matter
1. **Securing AI infrastructure** (the core opportunity): model artefact storage and provenance, training data access boundaries, GPU cluster and node isolation, inference endpoint authN/authZ and rate limiting, vector DB / RAG datastore access control and tenant leakage, model registry permissions, secrets in notebooks, cloud AI service IAM (Bedrock, Azure OpenAI, Vertex AI), cost-based DoS.
2. **Agentic AI and MCP security** (the newest and least contested): tool invocation authorization, agent identity and credential scoping, confused-deputy in agent chains, MCP server trust, audit trails for agent actions, human-in-the-loop gates. Job-posting data shows AI agents as the fastest-growing new skill category on security engineer postings.
3. **LLM application security:** OWASP Top 10 for LLM Applications, prompt injection (direct and indirect), insecure output handling, excessive agency, guardrail implementation and its limits.
4. **AI supply chain:** unsafe model formats (pickle deserialization), model provenance, signing, SLSA/SCVS applied to models, scanning tools.
5. **AI governance basics (A):** NIST AI RMF, EU AI Act obligations at a summary level, model inventory.
6. **AI-assisted security work:** using LLMs to draft detections, IaC policies and IR timelines — with review discipline.

## Which AI topics do NOT matter
- Training or fine-tuning models yourself.
- Transformer architecture internals, backpropagation, optimizer theory.
- Building ML pipelines, feature engineering, MLOps as a practitioner.
- Adversarial ML research (evasion/extraction attack mathematics) — awareness only.
- Prompt engineering as a standalone discipline.
- Vendor "AI SOC" product demos.
- Building your own LLM-based security product as a portfolio project. Hiring managers have seen hundreds.

## How much ML knowledge is actually needed
**Conceptual only.** You need to be able to: draw the lifecycle (data → training → artefact → registry → serving → inference → feedback), name the assets at each stage, identify who can access each one, and explain what an attacker gains at each. You need to read a model card and an inference API spec. You do not need to be able to train anything. Roughly 20–30 hours of study gets you to the level that matters for a cloud security role.

## AI Security opportunities
Emerging titles: AI Security Engineer, ML Security Engineer, AI Red Team Specialist, AI Security Architect. Comp reported at ~$153–188K average with top quartile ~$237K; niche demand growth reported around 74% YoY. Some DevSecOps postings now list OWASP LLM Top 10 and hands-on AI security credentials as *required*.

## AI Infrastructure Security opportunities
This is the higher-value and less crowded half. Companies building AI platforms need people who can secure GPU clusters, multi-tenant inference, training-data boundaries and agent credential scoping — which is cloud security work with new asset types. Your Phases 4, 6 and 7 transfer almost completely. GCP's growth is largely AI-driven, which is the argument for adding GCP if you take this path.

## AI Roadmap for Cloud Security Professionals (8–10 weeks, run *after* Phase 7)

**Block 1 — Foundations (2 weeks)**
- ML lifecycle and asset inventory; training vs inference vs fine-tuning; what a model artefact actually is.
- Read: OWASP Top 10 for LLM Applications; MITRE ATLAS; NIST AI RMF (skim).
- Deliverable: a one-page asset/trust-boundary diagram of a generic AI platform.

**Block 2 — AI infrastructure security (3 weeks)**
- Cloud AI service IAM: Bedrock, Azure OpenAI, Vertex AI — permissions, private networking, logging, data-retention settings.
- Vector database access control and multi-tenant isolation.
- Model registry and artefact storage permissions; signing model artefacts with Cosign.
- GPU node pool isolation in Kubernetes; notebook environment security.
- Deliverable: Terraform for a locked-down AI workload — private inference endpoint, scoped IAM, full audit logging, tenant-isolated RAG store.

**Block 3 — LLM and agent security (2 weeks)**
- Prompt injection direct and indirect; practise with Gandalf; implement guardrails with LLM Guard.
- Red-team an application with PyRIT and Garak; document findings.
- Agent/MCP security: tool authorization scoping, agent credential design, audit logging of tool calls.
- Deliverable: a red-team report against a deliberately vulnerable LLM app, with mitigations.

**Block 4 — Supply chain and detection (1–2 weeks)**
- Scan model files with Picklescan; understand unsafe serialization; safetensors.
- Provenance and signing for models; SBOM for AI dependencies.
- Write detections for AI-specific abuse: anomalous inference volume, model artefact modification, unusual agent tool invocation, training data access spikes.
- Deliverable: 8 detection rules for AI workload abuse.

**Block 5 — Portfolio consolidation (1 week)**
- Publish a written "Securing AI Workloads on AWS" reference architecture with code. This is currently a thin-content area and ranks well.

---

# Certifications Analysis

**Overall position:** take **two or three, not eight.** Certifications get you past filters; artefacts get you hired. A candidate with four certs and no repos reads as someone who studies rather than builds. Do a cert *after* the corresponding phase, as a forcing function to close gaps — never as the learning method itself.

## AWS Certified Security – Specialty (SCS-C02/C03)
- **Value:** High. The most directly named credential for this role; associated US salary bands ~$145–175K and the largest opening pool of the three platform security certs (~12–15K US openings).
- **Difficulty:** Hard. Assumes real AWS operational experience; heavily scenario-based on IAM, KMS and logging.
- **ROI:** **Highest of any cert here.** Directly maps to daily work.
- **Best timing:** End of Phase 4. **Take it.**

## AWS Certified Solutions Architect – Associate (SAA)
- **Value:** Moderate. Broad AWS literacy, widely recognised, but not a security credential.
- **Difficulty:** Moderate.
- **ROI:** Good *only* if you're weak on general AWS architecture; otherwise it duplicates Phase 4 learning.
- **Best timing:** Mid-Phase 4, optional. **Skip if you're already building landing zones in Terraform** — go straight to the Security Specialty.

## AZ-500 (Azure Security Engineer Associate)
- **Value:** High in enterprise, finance, healthcare and government markets; ~8–11K US openings, ~$130–160K associated bands.
- **Difficulty:** Moderate — easier than the AWS Security Specialty.
- **ROI:** Strong if your market is Azure-heavy or you want a second-platform signal cheaply.
- **Best timing:** End of Phase 5. **Take it if enterprise/regulated is your target; otherwise optional.**

## SC-100 (Cybersecurity Architect Expert)
- **Value:** Low *for this target role*. It's an architect-level, strategy-oriented credential.
- **Difficulty:** Moderate-hard, but tests breadth and design language rather than engineering depth.
- **ROI:** Poor at intermediate level.
- **Best timing:** 2+ years into a senior/architect trajectory. **Skip for now.**

## CompTIA Security+
- **Value:** Low-moderate. Useful for HR filters, DoD 8570 IAT Level II compliance, and US federal/contractor roles — which matters a lot if you're targeting the Northern Virginia market.
- **Difficulty:** Easy.
- **ROI:** Good *only* for compliance-gated markets or if you have no credentials at all and need a filter-pass. Otherwise it signals junior.
- **Best timing:** Early (during Phase 3) or never. **Take only if targeting US federal/defence.**

## CISSP
- **Value:** High for management and HR filters, low for engineering evaluation. Requires 5 years' experience (Associate status otherwise).
- **Difficulty:** Hard — broad, memorisation-heavy, management-framed.
- **ROI:** Poor for an intermediate engineer. Excellent later if you move toward leadership.
- **Best timing:** Year 5+. **Skip.**

## CCSK (Certificate of Cloud Security Knowledge)
- **Value:** Low-moderate. Vendor-neutral, cheap, open-book, good conceptual coverage (CSA CCM, shared responsibility).
- **Difficulty:** Easy.
- **ROI:** Reasonable as a fast confidence-builder, weak as a differentiator.
- **Best timing:** Optional, during Phase 3. **Skip unless you want a cheap early credential.**

## CCSP
- **Value:** Moderate-high in governance-adjacent, consulting, multi-cloud advisory and compliance-heavy organisations. Weaker signal in hands-on engineering teams.
- **Difficulty:** Hard; requires 5 years' experience for full certification.
- **ROI:** Poor at intermediate engineering level; good for a later advisory pivot.
- **Best timing:** Year 4+. **Skip.**

## Worth considering instead
- **Terraform Associate** — cheap, fast, directly relevant, and unusually well-recognised for the effort.
- **CKS (Certified Kubernetes Security Specialist)** — hands-on, performance-based, and aligned with the highest salary premium. Requires CKA first, which is real cost. **Strong choice after Phase 6** if targeting cloud-native employers.
- **An AI security credential** — the market is immature and credentials are unproven; prefer a published portfolio project until the space settles.

## Recommended set
**AWS Security Specialty + one of (AZ-500 | CKS) + Terraform Associate.** Three credentials, roughly 10–12 weeks of total prep spread across phases.

---

# Portfolio Projects

**Rules that apply to all 25:** every project lives in a public Git repo; every repo has a README explaining the *problem*, the *decisions*, and the *trade-offs*; infrastructure is in Terraform; no tutorial clones. Five well-documented repos beat twenty thin ones.

## Beginner-to-Intermediate (10)

**1. Network Forensics Notebook**
- *Objective:* Diagnose 10 network failures from packet capture.
- *Tech:* Wireshark, tcpdump, nginx, OpenSSL.
- *Skills:* TCP/TLS/DNS debugging, evidence-based reasoning.
- *Resume value:* Moderate alone, high as proof for the fundamentals interviews people fail.

**2. Private CA with Automated Issuance**
- *Objective:* Two-tier CA issuing short-lived certs, with rotation.
- *Tech:* OpenSSL, step-ca, mTLS demo services.
- *Skills:* PKI design, cert lifecycle, mTLS.
- *Resume value:* Moderate-high; PKI competence is rare.

**3. Linux Hardening Toolkit**
- *Objective:* Automated, verifiable host hardening with written rationale per control.
- *Tech:* Ansible, auditd, systemd sandboxing, Lynis.
- *Skills:* Linux internals, automation, control justification.
- *Resume value:* Moderate; differentiates from CIS-script copiers.

**4. Container from Scratch**
- *Objective:* Build a container using namespaces, cgroups, chroot only.
- *Tech:* Linux kernel primitives, Bash/Go.
- *Skills:* Container isolation at kernel level.
- *Resume value:* High relative to effort — excellent interview story.

**5. OIDC-Secured Application Lab**
- *Objective:* Full auth code + PKCE flow with role-based authorization, plus a documented token-theft scenario.
- *Tech:* Keycloak, Python/Node.
- *Skills:* OAuth/OIDC, JWT validation, session design.
- *Resume value:* High; auth questions appear in nearly every interview.

**6. Threat Model Portfolio**
- *Objective:* STRIDE models of three real open-source architectures with prioritised mitigations.
- *Tech:* Threat Dragon, Markdown, diagrams.
- *Skills:* Structured analysis, written communication.
- *Resume value:* High; shows judgment, which is the scarce quality.

**7. AWS Account Baseline in Terraform**
- *Objective:* Secure single-account baseline: CloudTrail, Config, GuardDuty, IAM baseline, budget alarms.
- *Tech:* Terraform, AWS.
- *Skills:* IaC, AWS security services.
- *Resume value:* Moderate (common), but table stakes.

**8. IAM Privilege Escalation Lab**
- *Objective:* Build, exploit and remediate five AWS privesc paths.
- *Tech:* AWS IAM, Pacu, Terraform.
- *Skills:* IAM evaluation logic, attacker perspective.
- *Resume value:* High; directly answers the most common AWS interview question.

**9. Cloud Log Source Catalogue**
- *Objective:* Document every AWS/Azure security log source: what it records, what it misses, cost, and detection use.
- *Tech:* Markdown, AWS/Azure, sample events.
- *Skills:* Telemetry knowledge, cost awareness.
- *Resume value:* Moderate-high; unusually practical, and useful to you forever.

**10. Secrets Remediation Pipeline**
- *Objective:* Detect secrets in a repo's history, remediate, rotate, and prevent recurrence.
- *Tech:* Gitleaks/TruffleHog, pre-commit, Secrets Manager.
- *Skills:* Supply chain hygiene, incident process.
- *Resume value:* Moderate.

## Intermediate (10)

**11. Multi-Account AWS Landing Zone**
- *Objective:* 4+ account org with OU structure, 10+ SCPs, centralised logging into an immutable archive.
- *Tech:* Terraform, AWS Organizations, Control Tower concepts.
- *Skills:* Org-scale design, guardrails, log architecture.
- *Resume value:* **Very high.** This is the artefact that most closely matches the job.

**12. Secure Terraform Module Library**
- *Objective:* Reusable secure-by-default modules with versioning, docs and tests.
- *Tech:* Terraform, Terratest, terraform-docs.
- *Skills:* Building for other engineers, secure defaults.
- *Resume value:* Very high; proves builder mindset.

**13. Zero-Static-Credential CI/CD Pipeline**
- *Objective:* PR-triggered pipeline with IaC scanning, secret scanning, policy gate and OIDC-authenticated deploy.
- *Tech:* GitHub Actions, OIDC, Checkov, Conftest, Terraform.
- *Skills:* CI/CD security, policy-as-code, workload identity.
- *Resume value:* Very high.

**14. Custom Policy Pack**
- *Objective:* 15+ tested Rego/Checkov policies with documented rationale and exception workflow.
- *Tech:* OPA/Rego, Conftest, Checkov.
- *Skills:* Policy authoring, testing discipline.
- *Resume value:* High.

**15. Hardened Kubernetes Platform**
- *Objective:* Cluster with restricted PSA, Kyverno policy set, default-deny network policies, signed images, Falco.
- *Tech:* EKS/kind, Kyverno, Cilium/Calico, Cosign, Falco.
- *Skills:* The full K8s security surface.
- *Resume value:* **Very high** — highest salary-premium skill, demonstrated.

**16. Container Escape Catalogue**
- *Objective:* Five documented escapes with detection and prevention for each.
- *Tech:* Docker, Kubernetes, Falco, seccomp/AppArmor.
- *Skills:* Runtime security, attacker perspective.
- *Resume value:* High.

**17. Detection-as-Code Repository**
- *Objective:* 25+ Sigma rules for cloud techniques, CI-validated, with ATT&CK coverage mapping and false-positive profiles.
- *Tech:* Sigma, GitHub Actions, Stratus Red Team.
- *Skills:* Detection engineering, testing, coverage reasoning.
- *Resume value:* **Very high**; almost no intermediate candidates have this.

**18. Cloud Incident Response Exercise**
- *Objective:* Simulate leaked key → enumeration → persistence → exfil; respond and publish a real postmortem.
- *Tech:* AWS, CloudGoat/Stratus, Athena.
- *Skills:* IR, scoping, evidence handling, written communication.
- *Resume value:* Very high — the postmortem itself is the artefact.

**19. Azure Landing Zone + Entra Baseline**
- *Objective:* Management group hierarchy, policy initiatives, Conditional Access design, PIM, diagnostic settings enforcement.
- *Tech:* Terraform AzureRM, Azure Policy, Entra ID.
- *Skills:* Second-platform competence, identity depth.
- *Resume value:* High.

**20. Cloud Control Mapping Reference**
- *Objective:* 40 security controls mapped across AWS/Azure/GCP with honest notes on where equivalence breaks.
- *Tech:* Markdown/site, hands-on verification.
- *Skills:* Multi-cloud reasoning, technical writing.
- *Resume value:* High; also a genuine content asset that attracts recruiters.

## Hiring-Manager-Impressive (5)

**21. Complete Cloud Security Platform**
- *Objective:* One coherent system: multi-account landing zone + module library + CI/CD guardrails + K8s policy platform + detection pipeline, all in code, with a written architecture doc and operating model.
- *Tech:* Terraform, AWS, EKS, Kyverno, GitHub Actions, Sigma, Falco.
- *Skills:* Everything in Phases 4–8, integrated.
- *Resume value:* **Highest.** This alone can carry an application. Build it incrementally across phases rather than at the end.

**22. Attack Path Analysis Engine**
- *Objective:* Graph cross-account/cross-service trust relationships, identify shortest paths to sensitive data, measure improvement after remediation.
- *Tech:* Cartography/Steampipe, Neo4j, Python.
- *Skills:* Graph reasoning, IAM depth, custom tooling.
- *Resume value:* Very high; demonstrates engineering, not configuration.

**23. Secured AI Workload Reference Architecture**
- *Objective:* Private inference endpoint, scoped IAM, tenant-isolated RAG store, signed model artefacts, full audit logging, AI-abuse detections — plus a published write-up.
- *Tech:* Terraform, Bedrock/Azure OpenAI, Kubernetes, Cosign, vector DB.
- *Skills:* The highest-growth demand area, demonstrated concretely.
- *Resume value:* Very high and currently rare.

**24. Guardrail Effectiveness Study**
- *Objective:* Measure your own controls: deploy intentionally misconfigured infrastructure at scale, measure what your guardrails caught, what they missed, detection latency, and false-positive rate. Publish the numbers.
- *Tech:* Terraform, Stratus Red Team, Prowler, custom scripts.
- *Skills:* Measurement, intellectual honesty, security-program thinking.
- *Resume value:* Very high — almost nobody measures, and hiring managers notice immediately.

**25. Open-Source Contribution**
- *Objective:* Meaningful merged contributions to Prowler, Kyverno, Checkov, Falco, Sigma rules, or a cloud provider's Terraform modules.
- *Tech:* Varies.
- *Skills:* Working in someone else's codebase to someone else's standard.
- *Resume value:* Very high; external validation you cannot manufacture.

---

# Job Preparation

## Interview Roadmap
Typical loop for intermediate cloud security roles: recruiter screen → technical screen (fundamentals + cloud) → practical exercise (IAM policy review, Terraform review, or incident scenario) → system/security design → behavioural/cross-functional → hiring manager.

Preparation sequence, starting ~8 weeks before applying:
1. **Weeks 1–2 — Fundamentals drilling.** Networking, Linux, auth protocols. Verbal, out loud, timed. This is where most candidates lose.
2. **Weeks 3–4 — Cloud scenario practice.** 30 AWS/Azure scenarios: "design X," "this broke, why," "how would you detect Y." Write answers first, then deliver them verbally in under three minutes.
3. **Week 5 — Design interviews.** Practise five designs: multi-account structure, secrets platform, log pipeline, K8s guardrails, incident response process. Use a consistent structure: requirements → threat model → design → trade-offs → failure modes → what you'd do with more time.
4. **Week 6 — Practical exercises.** Review flawed Terraform and IAM policies under time pressure. Write a detection live. Read someone else's code and critique it.
5. **Week 7 — Behavioural.** Prepare six stories in STAR form: a time you were overruled; a control you had to roll back; a disagreement with an engineering team; an incident you handled; something you got wrong; a time you said yes with conditions.
6. **Week 8 — Your own portfolio.** Be able to explain any decision in any of your repos, including the ones you'd now make differently.

Always ask, at the end: how does the security team interact with platform engineering, and what's the most recent thing you shipped?

## Resume Roadmap
- One page until 8 years' experience. No photos, no skill bar charts, no objective statement.
- Structure: summary (2 lines) → skills (grouped, no proficiency ratings) → experience → projects → certifications → education.
- Every bullet: **action + technology + measurable outcome.** "Reduced IAM policy findings 78% by shipping a secure-by-default Terraform role module consumed by 14 services" beats "responsible for IAM."
- Include 3–4 portfolio projects with links if your professional experience is light. Put them above experience if the projects are stronger.
- Mirror the exact terminology of the posting (ATS keyword matching is real): "Terraform," "Kubernetes," "CI/CD," "IAM," "detection engineering."
- Cut: Word/Excel, soft-skill lists, high school, "passionate about cybersecurity."
- Tailor per application. Three tailored applications beat thirty generic ones.

## GitHub Roadmap
- **Pin five repos**, in priority order: landing zone, K8s platform, CI/CD pipeline, detection-as-code, one write-up-heavy project.
- Every pinned repo needs: a README with problem/architecture diagram/decisions/trade-offs/limitations, working code, a licence, and no secrets in history.
- **Commit history should look like work**, not a single "initial commit" dump. Commit incrementally as you build.
- Include an `ADR/` or `docs/decisions/` folder in at least one repo — architecture decision records signal seniority strongly.
- Add tests and CI to at least two repos.
- Profile README: one short paragraph, what you work on, links.
- Delete or archive tutorial follow-alongs and abandoned repos.

## LinkedIn Roadmap
- Headline stating role and stack, not aspiration: "Cloud Security Engineer — AWS, Kubernetes, Terraform, Detection Engineering."
- About section: 4–5 lines, what you build, what you're deepening now.
- Turn on "Open to work" recruiter-only; set the exact titles you want.
- Follow and engage with cloud security practitioners, not motivational accounts.
- Post a short write-up each time you finish a portfolio project — the project is the content; don't write opinion posts without artefacts.
- Connect with engineers on teams you're interested in *before* applying, with a specific question, not a pitch.
- Keep skills section to ~12 relevant items, endorsed or not.

## Personal Branding Roadmap
Branding here means *evidence in public*, not audience-building. Priority order:
1. **Technical write-ups** on a simple blog or GitHub Pages — 6–10 posts, each derived from something you built. Write the post you wished existed when you were stuck. Thin areas that rank well right now: AI workload security on cloud, Kyverno policy patterns, cloud detection tuning, SCP design.
2. **One deep artefact** that people reference — the cloud control mapping reference or the guardrail effectiveness study are good candidates.
3. **Open-source contributions** — durable, verifiable credibility.
4. **Conference/meetup talks** — a local cloud or security meetup talk is achievable within a year and is disproportionately effective.
5. **Answering questions** in cloud security communities with substance.

Do not: chase follower counts, post daily, repackage news, or build a personal brand before you have anything built.

---

# 90% Rule

The ten skills carrying ~90% of employability value, ordered by leverage:

1. **AWS IAM at evaluation-logic depth** — policy types, precedence, trust, escalation paths. The most-tested, most-used, least-mastered skill in the field.
2. **Terraform** — write, review, and build secure-by-default modules. Named in ~15.5% of postings with a ~+$15K premium, and implied in far more.
3. **Networking fundamentals** — TCP/IP, DNS, TLS, proxies. The top cause of technical-screen failure and the basis of every cloud network control.
4. **Linux and container internals** — namespaces, capabilities, cgroups, processes. Container security is Linux security.
5. **Kubernetes security surfaces** — RBAC, admission control, network policy, runtime, secrets. Highest single named salary premium (~+$18K).
6. **CI/CD and supply chain security** — pipeline identity, OIDC over static keys, scanning placement, artefact provenance. Automation appears in ~44.5% of postings.
7. **Python automation** — ~41% of postings. The line between engineer and analyst.
8. **Cloud detection engineering and incident response** — log source knowledge, tested detections, IR execution. IR in ~31.4% of postings.
9. **Identity beyond one cloud** — OAuth/OIDC/SAML, Entra ID or Okta. ~+$18K premium and the most transferable skill you'll own.
10. **Written and verbal communication** — design docs, risk acceptances, postmortems, and the ability to say yes with conditions. This is the difference between being consulted and being routed around, and it is the most under-invested skill in security.

Everything else in this document is either a prerequisite for these ten or a multiplier on them.

---

# Skills To Ignore

## Low ROI
- **Broad compliance framework memorisation** (ISO 27001 clauses, NIST 800-53 control IDs, PCI-DSS requirement numbers). Know what each framework is *for* and how to map controls; memorising them is GRC work, not engineering, and it's the most LLM-automatable knowledge in security.
- **Vendor CNAPP/CSPM console mastery** (Wiz, Prisma, Orca, Lacework). Two weeks to learn on the job, employer-specific, and you won't choose the tool. Learn the concepts; skip the courses.
- **Multiple SIEM platforms.** One deeply. Query languages transfer; product menus don't.
- **Windows Server and Active Directory administration.** Postings mentioning Windows and AD show salaries *below* the security engineer baseline. Know Entra ID instead; leave on-prem AD to identity specialists unless your target employer is AD-heavy.
- **Every cloud service.** AWS has 250+ services. About 30 matter for security. Breadth-chasing here produces shallow candidates who fail depth questions.
- **Hardware/physical security, HSM operations, SCIF procedures** unless you're targeting a specific regulated employer.

## Outdated
- **Long-lived access keys and static credential management practices.** The industry has moved to federated workload identity; expertise in rotating static keys is expertise in a pattern you should be deleting.
- **Perimeter-centric network security** — DMZ design, traditional firewall rule management as a primary skill.
- **Manual configuration and console-driven administration.** If your evidence is screenshots, it reads as pre-2020.
- **VM-centric patching and golden-image ops as a core identity.** Still necessary, no longer differentiating; immutable infrastructure moved the work.
- **Agent-based on-prem DLP and legacy endpoint tooling** for a cloud role.
- **ITIL-style change management expertise** in an environment where changes ship through pull requests.
- **Waterfall-style annual security assessments** as a primary methodology.

## Overhyped
- **Cloud penetration testing as a career identity.** Small market, enormous applicant supply, and most cloud "pentest" findings are configuration issues a CSPM finds for free. Valuable as a *perspective* inside an engineering role; poor as a job target.
- **CTF and HackTheBox rankings.** Fun, genuinely educational, but hiring managers for defensive engineering roles weight them near zero. Time spent there competes directly with building guardrails.
- **CISSP at intermediate level.** Excellent for management filters, poor signal for engineering ability, expensive in time.
- **"Prompt engineering" as a security skill.** The durable skills are AI *infrastructure* and *agent authorization* security.
- **AI-powered security products as a study topic.** Learn to secure AI systems; don't study vendor claims about AI securing you.
- **Blockchain and Web3 security.** Demand collapsed and has not recovered; opportunity cost is severe.
- **Quantum-safe cryptography as a 2026 study priority.** Real 2028–2032 workstream. Awareness-level only right now — know what crypto-agility means and move on.
- **Balanced tri-cloud expertise.** Employers hire for one platform. "Equally strong in AWS, Azure and GCP" reads as "not strong in any."
- **Collecting certifications.** Past three, each additional certification has near-zero marginal value and a rising opportunity cost against portfolio work.

---

# Final Optimized Roadmap

All three routes assume the same target: hireable as an **intermediate Cloud Security Engineer**, not a beginner. Hours are focused study/build hours, not passive video watching.

## Route 1 — Fastest (7–8 months, ~25 hrs/week, ~750–850 hours)

For someone able to study near full-time, or with existing IT/dev/sysadmin experience to shortcut Phases 1–2.

| Block | Weeks | Content |
|---|---|---|
| 1 | 1–4 | Networking (compressed — TCP/IP, DNS, TLS, HTTP, proxies only; skip switching/VPN depth) |
| 2 | 5–7 | Linux (compressed — shell, permissions, processes, kernel primitives, auditd) |
| 3 | 8–11 | Security engineering foundations (IAM theory, OAuth/OIDC, PKI, threat modelling) |
| 4 | 12–21 | **AWS mastery — full depth, no compression** |
| 5 | 22–27 | Kubernetes security (moved ahead of second cloud) |
| 6 | 28–32 | IaC + DevSecOps |
| 7 | 33–35 | Cloud detection engineering (compressed) |
| Cert | ~week 21 | AWS Security Specialty |
| Portfolio | throughout | Projects 11, 13, 15, 17, and 21 built incrementally |

**Cuts:** second cloud platform (Azure only at awareness level), Phase 9 advanced, AI roadmap. **Risk:** single-platform candidate; weaker in design interviews. **Mitigation:** add Azure and Phase 9 in your first six months on the job.

**Evidence basis:** AWS + Kubernetes + Terraform + CI/CD covers the four highest-premium skill clusters; the single-platform gap is the cheapest thing to fix after you're employed.

## Route 2 — Balanced (11–14 months, ~15–20 hrs/week, ~950–1,150 hours) — **Recommended**

Full Phases 1 → 9 as written, in order, with the AI roadmap inserted after Phase 7.

| Phase | Weeks | Cumulative |
|---|---|---|
| 1 Networking | 6–8 | ~2 months |
| 2 Linux | 5–7 | ~3.5 months |
| 3 Security foundations | 6–8 | ~5 months |
| 4 AWS mastery | 10–12 | ~8 months |
| 5 Azure (+GCP awareness) | 6–8 | ~9.5 months |
| 6 Containers/Kubernetes | 7–9 | ~11.5 months |
| 7 IaC/DevSecOps | 6–8 | ~13 months |
| AI roadmap | 8–10 (overlap with 8) | — |
| 8 Detection engineering | 5–7 | ~14 months |
| 9 Advanced | 6–8 | ~15.5 months |

**Start applying at the end of Phase 7 (~month 13), not at the end.** Phases 8–9 continue while you interview. Certifications: AWS Security Specialty at ~month 8, AZ-500 or CKS at ~month 11, Terraform Associate opportunistically.

**Evidence basis:** this sequence front-loads the two things that gate interviews (fundamentals, AWS IAM depth), then adds the highest-premium differentiators (Kubernetes, IaC, DevSecOps), then the low-competition specialisms (detection, AI). It matches the posting-frequency data: common-tier skills first (AWS 37.6%, automation 44.5%, IAM 20.3%), differentiator-tier second (Kubernetes 17.9%, Terraform 15.5%, DevSecOps 14.7%).

## Route 3 — Deep Expertise (18–24 months, ~15 hrs/week, ~1,400–1,800 hours)

Route 2 plus:
- **Phases 1–3 at full depth** rather than pragmatic depth, including BGP, eBPF, applied cryptography, and a self-built identity provider.
- **GCP as a genuine third platform** (6 weeks), targeting the AI-infrastructure market where GCP concentration and the ~+$16.7K premium apply.
- **Programming depth:** Go in addition to Python (6–8 weeks), enabling real tool development and contribution to Kubernetes-ecosystem projects.
- **Full AI security roadmap** including hands-on LLM red teaming and agent/MCP security (10 weeks).
- **Open-source contribution as a sustained commitment** (ongoing) — Prowler, Kyverno, Checkov, Falco.
- **Post-quantum and confidential computing** at working rather than awareness level (4 weeks).
- **Two of the five hiring-manager-impressive projects** built to production quality, plus published write-ups.

**Target outcome:** not intermediate but *senior-ready* — competitive for Staff/Principal tracks within 2 years of employment, and positioned for the Cloud Security Architect or AI Security Architect path.

**Honest trade-off:** you will be employable at intermediate level around month 13 regardless. Route 3's extra 6–11 months of pre-employment study is almost always better spent *on the job*, where you get paid, get real constraints, and get scale you cannot simulate. Choose Route 3 only if you cannot enter the market yet for external reasons (visa, location, current commitments), not as a confidence-building measure.

## Decision rule

- **Existing IT/dev/ops experience + able to study 25 hrs/week** → Route 1.
- **Starting from basic computer knowledge, studying alongside other commitments** → Route 2.
- **Cannot enter the market for 18+ months anyway** → Route 3.

In all three cases: apply before you feel ready. The gap between "ready" and "hired" is filled by the portfolio, not by another phase.
