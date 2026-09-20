import { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("Database already seeded");
    return;
  }

  // Create default owner user (password: changeme123)
  const owner = await prisma.user.create({
    data: {
      email: "owner@cloudsecurity.local",
      name: "Owner",
      passwordHash: "placeholder", // Will be hashed on first login
    },
  });

  // Roadmap data parsed from docs/cloud-security-roadmap.md
  const phases = [
    {
      order: 1,
      title: "Deep Networking Foundation",
      objective: "Reason about any packet, name resolution, or TLS failure without guessing.",
      estimatedWeeks: 7,
      topics: [
        {
          title: "TCP/IP Model",
          objective: "Understand the foundational networking model in practice.",
          microtopics: [
            { title: "Three-way handshake and connection states", depth: "M" },
            { title: "MSS/MTU, retransmission, and congestion", depth: "M" },
            { title: "SYN flood mechanics and UDP tradeoffs", depth: "M" },
            { title: "Ephemeral ports and connection tracking", depth: "P" },
          ],
        },
        {
          title: "DNS",
          objective: "Master name resolution from recursive queries to security implications.",
          microtopics: [
            { title: "Recursive vs iterative queries", depth: "M" },
            { title: "Record types (A, AAAA, CNAME, TXT, MX, SRV, NS, CAA)", depth: "M" },
            { title: "TTL, caching, and split-horizon DNS", depth: "M" },
            { title: "DNS over TLS/HTTPS and DNSSEC", depth: "M" },
            { title: "DNS exfiltration, tunneling, and rebinding", depth: "M" },
          ],
        },
        {
          title: "Routing",
          objective: "Understand how packets find their path across networks.",
          microtopics: [
            { title: "Longest-prefix match and static vs dynamic routing", depth: "M" },
            { title: "Default routes and route tables", depth: "M" },
            { title: "Asymmetric routing and BGP concepts", depth: "A" },
            { title: "NAT, PAT, and CGNAT", depth: "M" },
          ],
        },
        {
          title: "Switching and VLANs",
          objective: "Understand Layer 2 networking fundamentals.",
          microtopics: [
            { title: "MAC learning and VLANs", depth: "P" },
            { title: "Trunking and broadcast domains", depth: "P" },
            { title: "ARP, ARP spoofing, and STP", depth: "A" },
          ],
        },
        {
          title: "VPNs",
          objective: "Understand encrypted network tunnels.",
          microtopics: [
            { title: "IPsec phases 1/2 and IKEv2", depth: "P" },
            { title: "Tunnel vs transport mode, WireGuard", depth: "P" },
            { title: "SSL VPN and split tunneling risk", depth: "P" },
            { title: "Site-to-site vs client VPN", depth: "P" },
          ],
        },
        {
          title: "TLS/PKI",
          objective: "Master the security protocol underpining all HTTPS.",
          microtopics: [
            { title: "TLS 1.2 vs 1.3 handshake differences", depth: "M" },
            { title: "Cipher suites and forward secrecy", depth: "M" },
            { title: "Certificate chains and SNI/ESNI", depth: "M" },
            { title: "mTLS, pinning, OCSP/CRL, session resumption", depth: "M" },
            { title: "Common handshake failure causes", depth: "M" },
          ],
        },
        {
          title: "Load Balancing and Proxies",
          objective: "Understand traffic distribution and reverse proxy security.",
          microtopics: [
            { title: "L4 vs L7 load balancing and algorithms", depth: "P" },
            { title: "Health checks, TLS termination, sticky sessions", depth: "P" },
            { title: "Reverse proxies: nginx/Envoy config and header manipulation", depth: "P" },
            { title: "Request smuggling, WAF placement, caching risks", depth: "P" },
          ],
        },
        {
          title: "HTTP Internals",
          objective: "Understand the protocol of the web at a deep level.",
          microtopics: [
            { title: "Methods, status semantics, headers", depth: "M" },
            { title: "Cookies and attributes, CORS", depth: "M" },
            { title: "HTTP/2, HTTP/3, chunked encoding, keep-alive", depth: "M" },
          ],
        },
      ],
    },
    {
      order: 2,
      title: "Linux Mastery",
      objective: "Operate, harden, and forensically inspect a Linux system.",
      estimatedWeeks: 6,
      topics: [
        {
          title: "Shell and Text Processing",
          objective: "Automate everything with command-line tools.",
          microtopics: [
            { title: "Pipes, redirection, process substitution", depth: "M" },
            { title: "Globbing, quoting rules, set -euo pipefail", depth: "M" },
            { title: "grep, awk, sed, jq, xargs, find", depth: "M" },
          ],
        },
        {
          title: "Permissions and Filesystem",
          objective: "Understand Linux security at the filesystem level.",
          microtopics: [
            { title: "ugo/rwx, setuid/setgid/sticky, umask", depth: "M" },
            { title: "ACLs, attributes (chattr)", depth: "M" },
            { title: "Why setuid binaries matter for privilege escalation", depth: "M" },
          ],
        },
        {
          title: "Processes and Signals",
          objective: "Understand process lifecycle and isolation.",
          microtopics: [
            { title: "fork/exec, PID namespaces, /proc inspection", depth: "M" },
            { title: "Signals, zombie/orphan processes", depth: "M" },
            { title: "lsof, strace, ss, cgroup accounting", depth: "M" },
          ],
        },
        {
          title: "systemd and Services",
          objective: "Manage system services and understand sandboxing.",
          microtopics: [
            { title: "Units, targets, timers vs cron", depth: "P" },
            { title: "journald logging", depth: "P" },
            { title: "Sandboxing directives (ProtectSystem, NoNewPrivileges)", depth: "P" },
          ],
        },
        {
          title: "Kernel Security Primitives",
          objective: "Understand the isolation mechanisms containers rely on.",
          microtopics: [
            { title: "Namespaces (pid, net, mnt, user, uts, ipc)", depth: "M" },
            { title: "cgroups v2", depth: "M" },
            { title: "Capabilities (CAP_SYS_ADMIN, CAP_NET_RAW, etc.)", depth: "M" },
            { title: "Seccomp profiles, AppArmor/SELinux", depth: "P" },
            { title: "eBPF concepts", depth: "A" },
          ],
        },
        {
          title: "Identity and Authentication",
          objective: "Secure Linux authentication mechanisms.",
          microtopics: [
            { title: "PAM stack and sudoers syntax", depth: "P" },
            { title: "SSH server hardening and key auth", depth: "P" },
            { title: "authorized_keys options", depth: "P" },
          ],
        },
        {
          title: "Storage and Boot",
          objective: "Understand disk encryption and boot process.",
          microtopics: [
            { title: "LUKS, LVM, mount options (nodev,nosuid,noexec)", depth: "A-P" },
            { title: "initramfs, bootloader security", depth: "A" },
            { title: "Immutable/OS-image distros", depth: "A" },
          ],
        },
        {
          title: "Logging",
          objective: "Master Linux observability.",
          microtopics: [
            { title: "journald vs rsyslog", depth: "M" },
            { title: "auditd rules and configuration", depth: "M" },
            { title: "Log shipping and forensic usefulness", depth: "M" },
          ],
        },
        {
          title: "Scripting",
          objective: "Automate with Bash and Python.",
          microtopics: [
            { title: "Bash for glue scripts", depth: "M" },
            { title: "Python for automation over 40 lines", depth: "M" },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Security Engineering Foundations",
      objective: "Own the conceptual core — identity, cryptography, threat modelling.",
      estimatedWeeks: 7,
      topics: [
        {
          title: "Threat Modelling",
          objective: "Systematically identify and mitigate security risks.",
          microtopics: [
            { title: "STRIDE methodology", depth: "M" },
            { title: "Attack trees and trust boundaries", depth: "M" },
            { title: "Data Flow Diagrams (DFDs)", depth: "M" },
            { title: "Abuse cases and MITRE ATT&CK Cloud matrix", depth: "M" },
            { title: "LINDDUN for privacy", depth: "A" },
          ],
        },
        {
          title: "IAM Theory",
          objective: "Master identity and authorization concepts.",
          microtopics: [
            { title: "Authentication vs Authorization", depth: "M" },
            { title: "RBAC, ABAC, ReBAC models", depth: "M" },
            { title: "Policy evaluation order and deny-by-default", depth: "M" },
            { title: "Least privilege vs least friction", depth: "M" },
            { title: "Privilege escalation paths and separation of duties", depth: "M" },
            { title: "JIT access and workload identity", depth: "M" },
            { title: "Non-human identity lifecycle", depth: "M" },
          ],
        },
        {
          title: "Authentication Protocols",
          objective: "Understand modern auth protocols deeply.",
          microtopics: [
            { title: "OAuth 2.0 grant types", depth: "M" },
            { title: "OIDC ID tokens vs access tokens", depth: "M" },
            { title: "JWT structure and signature validation", depth: "M" },
            { title: "alg:none vulnerability class", depth: "M" },
            { title: "SAML assertions and signature wrapping", depth: "P" },
            { title: "SCIM and Kerberos", depth: "A" },
            { title: "mTLS as identity and token lifetime tradeoffs", depth: "M" },
          ],
        },
        {
          title: "PKI",
          objective: "Master certificate infrastructure.",
          microtopics: [
            { title: "CA hierarchies and CSRs", depth: "M" },
            { title: "X.509 fields, extensions, key usage", depth: "M" },
            { title: "Revocation and cert lifecycle automation (ACME)", depth: "M" },
            { title: "Private CA design and key ceremony concepts", depth: "A" },
          ],
        },
        {
          title: "Cryptography",
          objective: "Understand crypto systems, not just algorithms.",
          microtopics: [
            { title: "Symmetric vs asymmetric encryption", depth: "P" },
            { title: "AES-GCM and nonce reuse", depth: "P" },
            { title: "Key wrapping and envelope encryption", depth: "P" },
            { title: "KDFs, argon2/bcrypt, HMAC, signing vs encrypting", depth: "P" },
            { title: "Randomness and post-quantum migration", depth: "A" },
          ],
        },
        {
          title: "Detection Theory",
          objective: "Understand telemetry and signal processing.",
          microtopics: [
            { title: "Telemetry sources and signal vs noise", depth: "P" },
            { title: "Detection-as-code and true/false positive economics", depth: "M" },
            { title: "Pyramid of Pain and alert fatigue", depth: "M" },
            { title: "MITRE mapping for cloud", depth: "M" },
          ],
        },
        {
          title: "Logging and Monitoring",
          objective: "Build observability into security systems.",
          microtopics: [
            { title: "Log vs metric vs trace", depth: "M" },
            { title: "Retention vs cost tradeoffs", depth: "M" },
            { title: "Tamper-evidence and centralisation", depth: "M" },
            { title: "Time synchronisation and forensic usefulness", depth: "M" },
          ],
        },
        {
          title: "Secure Design Patterns",
          objective: "Design systems with security as a first-class concern.",
          microtopics: [
            { title: "Defence in depth and fail-closed vs fail-open", depth: "M" },
            { title: "Blast radius and secure defaults", depth: "M" },
            { title: "Tenant isolation and secrets lifecycle", depth: "M" },
          ],
        },
      ],
    },
    {
      order: 4,
      title: "AWS Mastery",
      objective: "Own AWS security at production depth.",
      estimatedWeeks: 11,
      topics: [
        {
          title: "IAM Deep Dive",
          objective: "Master AWS IAM at evaluation-logic level.",
          microtopics: [
            { title: "Policy types: identity, resource, permission boundary, SCP, session policy", depth: "M" },
            { title: "Full evaluation logic and precedence order", depth: "M" },
            { title: "Principals, ARNs, condition keys", depth: "M" },
            { title: "sts:AssumeRole, external ID, confused-deputy problem", depth: "M" },
            { title: "Privilege escalation paths", depth: "M" },
            { title: "Access Analyzer, Access Advisor, policy simulation", depth: "P" },
          ],
        },
        {
          title: "VPC Architecture",
          objective: "Design secure network infrastructure.",
          microtopics: [
            { title: "CIDR design, subnets, route tables", depth: "M" },
            { title: "IGW/NAT/egress-only, security groups vs NACLs", depth: "M" },
            { title: "VPC endpoints (gateway vs interface) and endpoint policies", depth: "M" },
            { title: "PrivateLink, peering vs Transit Gateway", depth: "M" },
            { title: "VPC Flow Logs and DNS resolution", depth: "M" },
            { title: "Network Firewall and egress control patterns", depth: "P" },
          ],
        },
        {
          title: "EC2 Security",
          objective: "Secure compute instances.",
          microtopics: [
            { title: "IMDSv1 vs IMDSv2 and SSRF-to-credential chains", depth: "M" },
            { title: "Instance profiles and AMI hygiene", depth: "P" },
            { title: "EBS encryption and snapshot sharing risks", depth: "P" },
            { title: "SSM Session Manager as SSH replacement", depth: "P" },
          ],
        },
        {
          title: "S3 Security",
          objective: "Master object storage security.",
          microtopics: [
            { title: "Bucket vs object ownership and ACLs", depth: "M" },
            { title: "Bucket policies and Block Public Access", depth: "M" },
            { title: "Presigned URLs and their abuse", depth: "M" },
            { title: "SSE-S3/SSE-KMS/SSE-C/DSSE and bucket keys", depth: "M" },
            { title: "Replication, versioning, MFA delete, Object Lock", depth: "M" },
          ],
        },
        {
          title: "KMS",
          objective: "Master key management.",
          microtopics: [
            { title: "CMK vs AWS-managed vs owned, key policies", depth: "M" },
            { title: "Grants, encryption context, envelope encryption", depth: "M" },
            { title: "Multi-region keys and external key store", depth: "A" },
            { title: "Rotation semantics and cross-account key use", depth: "M" },
          ],
        },
        {
          title: "CloudTrail",
          objective: "Master cloud audit logging.",
          microtopics: [
            { title: "Management vs data vs Insights events", depth: "M" },
            { title: "Organisation trails and log file integrity", depth: "M" },
            { title: "Delivery latency realities and what is not logged", depth: "M" },
            { title: "CloudTrail Lake and per-service event naming", depth: "P" },
          ],
        },
        {
          title: "CloudWatch",
          objective: "Monitoring and alerting.",
          microtopics: [
            { title: "Logs, log groups, metric filters", depth: "P" },
            { title: "Logs Insights query language and alarms", depth: "P" },
            { title: "EventBridge rules for security automation", depth: "P" },
          ],
        },
        {
          title: "GuardDuty",
          objective: "Threat detection service.",
          microtopics: [
            { title: "Finding types worth alerting on vs not", depth: "P" },
            { title: "Malware Protection and EKS/RDS/Lambda protection", depth: "P" },
            { title: "Org-wide delegated administration and cost behaviour", depth: "P" },
          ],
        },
        {
          title: "Security Hub",
          objective: "Centralized security posture management.",
          microtopics: [
            { title: "Standards (CIS, FSBP, PCI) and ASFF schema", depth: "P" },
            { title: "Aggregation, automation rules, integration", depth: "P" },
          ],
        },
        {
          title: "Organizations and SCPs",
          objective: "Multi-account governance.",
          microtopics: [
            { title: "OU design and SCP evaluation with IAM", depth: "M" },
            { title: "Deny-list vs allow-list strategy", depth: "M" },
            { title: "Control Tower and landing zones", depth: "M" },
            { title: "Common baseline SCPs", depth: "M" },
          ],
        },
        {
          title: "Additional AWS Services",
          objective: "Supporting services for security operations.",
          microtopics: [
            { title: "Config + conformance packs", depth: "P" },
            { title: "Macie, Inspector, Secrets Manager vs Parameter Store", depth: "P" },
            { title: "WAF/Shield, ECR, Lambda security, Detective", depth: "P" },
            { title: "Backup + immutability", depth: "P" },
          ],
        },
      ],
    },
    {
      order: 5,
      title: "Second Platform: Azure",
      objective: "Secure an Azure subscription end to end and own Entra ID.",
      estimatedWeeks: 7,
      topics: [
        {
          title: "Entra ID",
          objective: "Master Azure identity and access management.",
          microtopics: [
            { title: "Tenants, users, groups, service principals vs managed identities", depth: "M" },
            { title: "App registrations and consent", depth: "M" },
            { title: "Conditional Access design", depth: "M" },
            { title: "PIM and JIT roles, Access Reviews", depth: "M" },
            { title: "Authentication methods, phishing-resistant MFA", depth: "M" },
            { title: "Token lifetimes, Entra ID Protection risk signals", depth: "M" },
          ],
        },
        {
          title: "RBAC and Governance",
          objective: "Control access at scale.",
          microtopics: [
            { title: "Management groups, subscriptions, resource groups", depth: "M" },
            { title: "Role definitions and assignments, deny assignments", depth: "M" },
            { title: "Azure Policy (audit/deny/deployIfNotExists)", depth: "M" },
            { title: "Initiatives, Blueprints, resource locks, tagging", depth: "M" },
          ],
        },
        {
          title: "Azure Networking",
          objective: "Secure network connectivity.",
          microtopics: [
            { title: "VNets, NSGs vs ASGs, UDRs", depth: "P" },
            { title: "Azure Firewall, Private Link, Service Endpoints", depth: "P" },
            { title: "Bastion, hub-and-spoke, Virtual WAN", depth: "P" },
            { title: "DDoS Protection", depth: "P" },
          ],
        },
        {
          title: "Data and Keys",
          objective: "Secure data at rest and in transit.",
          microtopics: [
            { title: "Key Vault access policies vs RBAC", depth: "P" },
            { title: "Managed HSM, Storage account security (SAS tokens)", depth: "P" },
            { title: "Disk Encryption, Defender for Storage", depth: "P" },
          ],
        },
        {
          title: "Detection and Monitoring",
          objective: "Azure security monitoring.",
          microtopics: [
            { title: "Microsoft Defender for Cloud, Microsoft Sentinel", depth: "P" },
            { title: "Azure Monitor, Log Analytics, diagnostic settings", depth: "M" },
            { title: "KQL query language", depth: "M" },
            { title: "Activity Log vs resource logs vs Entra logs", depth: "M" },
          ],
        },
        {
          title: "Compute and GCP Awareness",
          objective: "Azure compute security and GCP overview.",
          microtopics: [
            { title: "Managed identities, Defender for Containers", depth: "P" },
            { title: "GCP project/folder hierarchy and IAM inheritance", depth: "A" },
            { title: "GCP service accounts, Org Policy, VPC Service Controls", depth: "A" },
            { title: "GCP Cloud Audit Logs and Security Command Center", depth: "A" },
          ],
        },
      ],
    },
    {
      order: 6,
      title: "Containers and Kubernetes Security",
      objective: "Secure a Kubernetes platform end to end.",
      estimatedWeeks: 8,
      topics: [
        {
          title: "Docker/OCI Security",
          objective: "Secure container images and runtime.",
          microtopics: [
            { title: "Image layers, caching, Dockerfile security (non-root, pinned digests)", depth: "M" },
            { title: "Build context leakage, registry authn", depth: "P" },
            { title: "Image signing (Cosign/Sigstore), SBOM generation (Syft)", depth: "M" },
            { title: "Scanning (Grype/Trivy), distroless images", depth: "M" },
            { title: "docker.sock exposure, rootless mode, capabilities", depth: "M" },
          ],
        },
        {
          title: "Kubernetes Architecture",
          objective: "Understand K8s control plane components.",
          microtopics: [
            { title: "API server, etcd, scheduler, controller manager, kubelet", depth: "P" },
            { title: "CNI/CRI/CSI, managed vs self-managed control planes", depth: "P" },
          ],
        },
        {
          title: "K8s Authentication and Authorization",
          objective: "Control who and what can access the cluster.",
          microtopics: [
            { title: "Certificates, OIDC integration, ServiceAccounts", depth: "M" },
            { title: "RBAC roles vs cluster roles, escalation/bind/impersonate verbs", depth: "M" },
            { title: "Cloud IAM integration (IRSA, Workload Identity)", depth: "M" },
          ],
        },
        {
          title: "Pod Security",
          objective: "Enforce security at the pod level.",
          microtopics: [
            { title: "Pod Security Standards (privileged/baseline/restricted)", depth: "M" },
            { title: "Pod Security Admission, securityContext fields", depth: "M" },
            { title: "seccomp/AppArmor profiles, hostPath/hostNetwork dangers", depth: "M" },
            { title: "Container escape paths", depth: "M" },
          ],
        },
        {
          title: "Admission Control",
          objective: "Enforce policies on every API request.",
          microtopics: [
            { title: "Validating vs mutating webhooks", depth: "M" },
            { title: "OPA Gatekeeper and Kyverno", depth: "M" },
            { title: "Policy authoring, testing, failure modes", depth: "M" },
            { title: "Image provenance verification at admission", depth: "M" },
          ],
        },
        {
          title: "Network Policy",
          objective: "Control pod-to-pod communication.",
          microtopics: [
            { title: "Default-deny ingress and egress", depth: "M" },
            { title: "Namespace and pod selectors, CNI differences", depth: "M" },
            { title: "DNS policy gotchas, service mesh mTLS", depth: "P" },
            { title: "East-west vs north-south traffic", depth: "P" },
          ],
        },
        {
          title: "Runtime Security",
          objective: "Detect and respond to runtime threats.",
          microtopics: [
            { title: "Falco rules and eBPF-based detection", depth: "P-M" },
            { title: "Kubernetes audit log policy", depth: "P" },
            { title: "Drift detection, kill-vs-alert decisions", depth: "P" },
          ],
        },
        {
          title: "Secrets Management",
          objective: "Protect sensitive data.",
          microtopics: [
            { title: "Why base64 etcd Secrets aren't secret", depth: "M" },
            { title: "Encryption at rest with KMS provider", depth: "M" },
            { title: "External Secrets Operator, Vault Agent/CSI, Sealed Secrets", depth: "M" },
            { title: "Short-lived credentials over static secrets", depth: "M" },
          ],
        },
        {
          title: "Supply Chain and Multi-tenancy",
          objective: "Secure the container supply chain.",
          microtopics: [
            { title: "Admission-time signature verification, SLSA levels", depth: "P" },
            { title: "Provenance attestations, base image lifecycle", depth: "P" },
            { title: "Namespace isolation, resource quotas, vCluster/Kata", depth: "A-P" },
          ],
        },
      ],
    },
    {
      order: 7,
      title: "Infrastructure as Code and DevSecOps",
      objective: "Make secure the default path.",
      estimatedWeeks: 7,
      topics: [
        {
          title: "Git and Version Control",
          objective: "Use Git as a security tool.",
          microtopics: [
            { title: "Branching models, rebase vs merge, .gitignore discipline", depth: "M" },
            { title: "Signed commits, hooks, history rewriting to purge secrets", depth: "M" },
            { title: "CODEOWNERS, branch protection, monorepo vs polyrepo", depth: "M" },
          ],
        },
        {
          title: "Terraform",
          objective: "Master IaC for security infrastructure.",
          microtopics: [
            { title: "HCL, providers, state security (remote backend, encryption)", depth: "M" },
            { title: "Modules, versioning, workspaces, plan vs apply", depth: "M" },
            { title: "Drift, import, moved blocks, sentinel/OPA integration", depth: "M" },
            { title: "Provider auth without static keys, terraform-docs", depth: "M" },
            { title: "Testing (Terratest, terra test), secure-by-default modules", depth: "M" },
          ],
        },
        {
          title: "GitHub Actions",
          objective: "Secure CI/CD pipelines.",
          microtopics: [
            { title: "Workflow syntax, pull_request vs pull_request_target", depth: "M" },
            { title: "OIDC to cloud, GITHUB_TOKEN permissions scoping", depth: "M" },
            { title: "Third-party action pinning by SHA, secrets management", depth: "M" },
            { title: "Self-hosted runner risks, artefact poisoning, reusable workflows", depth: "M" },
          ],
        },
        {
          title: "CI/CD Security",
          objective: "Secure the build system as a privileged identity.",
          microtopics: [
            { title: "SLSA levels, provenance and attestation", depth: "M" },
            { title: "Dependency confusion, typosquatting, lockfiles", depth: "M" },
            { title: "Artifact signing, ephemeral runners, least-privilege deploy roles", depth: "M" },
            { title: "Separation of build and deploy", depth: "M" },
          ],
        },
        {
          title: "Policy as Code",
          objective: "Automate security policy enforcement.",
          microtopics: [
            { title: "OPA/Rego basics, Conftest, Checkov/tfsec/Trivy-IaC", depth: "M" },
            { title: "Custom policy authoring and testing", depth: "M" },
            { title: "Guardrail-vs-gate decisions and exception workflow", depth: "M" },
          ],
        },
        {
          title: "Scanning and Automation",
          objective: "Integrate security into development workflow.",
          microtopics: [
            { title: "SAST, SCA, secret scanning (Gitleaks/TruffleHog)", depth: "P" },
            { title: "Container scanning, DAWT (A), blocking vs reporting strategy", depth: "P" },
            { title: "Python for remediation, event-driven security, Cloud Custodian", depth: "M" },
          ],
        },
      ],
    },
    {
      order: 8,
      title: "Cloud Detection Engineering",
      objective: "Detect cloud-native attacks and run incidents.",
      estimatedWeeks: 6,
      topics: [
        {
          title: "Log Sources",
          objective: "Know what every log source covers and misses.",
          microtopics: [
            { title: "CloudTrail (management/data/Insights), VPC Flow Logs", depth: "M" },
            { title: "Route 53 resolver logs, S3 access logs, ALB logs", depth: "M" },
            { title: "EKS audit logs, Entra sign-in/audit logs", depth: "M" },
            { title: "Azure Activity + diagnostic logs, GCP Cloud Audit Logs", depth: "M" },
            { title: "Log gaps and limitations per source", depth: "M" },
          ],
        },
        {
          title: "Log Pipelines",
          objective: "Process telemetry for detection.",
          microtopics: [
            { title: "Collection, normalisation (OCSF/ECS), enrichment", depth: "P" },
            { title: "Routing, storage tiering, cost control", depth: "P" },
            { title: "Retention policy vs forensic need", depth: "P" },
          ],
        },
        {
          title: "SIEM",
          objective: "Master at least one SIEM platform.",
          microtopics: [
            { title: "Splunk SPL or Sentinel KQL (pick one, learn deeply)", depth: "P-M" },
            { title: "Elastic/OpenSearch, Athena/CloudTrail Lake", depth: "P" },
            { title: "Data models and schema design", depth: "P" },
          ],
        },
        {
          title: "Detection Rules",
          objective: "Write tested, version-controlled detections.",
          microtopics: [
            { title: "Sigma as portable format", depth: "M" },
            { title: "Detection-as-code in Git with CI testing", depth: "M" },
            { title: "Tuning methodology and alert enrichment", depth: "M" },
            { title: "Threshold vs behavioural vs anomaly detection", depth: "M" },
            { title: "Severity design and false positive cost", depth: "M" },
          ],
        },
        {
          title: "Cloud Attack Detection",
          objective: "Detect specific cloud attack techniques.",
          microtopics: [
            { title: "Credential theft via IMDS/SSRF", depth: "M" },
            { title: "Access key abuse, role chaining", depth: "M" },
            { title: "Persistence via IAM user/role or Lambda", depth: "M" },
            { title: "Disabling CloudTrail/GuardDuty, S3 exfiltration", depth: "M" },
            { title: "KMS key deletion, cross-account snapshot sharing", depth: "M" },
            { title: "OAuth consent grant abuse, Entra privilege escalation", depth: "M" },
            { title: "K8s exec and SA token theft, ransomware on object storage", depth: "M" },
          ],
        },
        {
          title: "Incident Response",
          objective: "Respond to cloud incidents effectively.",
          microtopics: [
            { title: "Cloud-specific IR lifecycle", depth: "M" },
            { title: "Evidence acquisition (snapshots, memory, logs)", depth: "M" },
            { title: "Containment without destroying evidence", depth: "M" },
            { title: "Credential revocation ordering and scoping", depth: "M" },
            { title: "Blast-radius determination and postmortem writing", depth: "M" },
          ],
        },
        {
          title: "Threat Hunting and Purple Teaming",
          objective: "Proactive security validation.",
          microtopics: [
            { title: "Hypothesis-driven hunts, baselining normal", depth: "P" },
            { title: "Frequency analysis and ATT&CK coverage mapping", depth: "P" },
            { title: "Stratus Red Team, Atomic Red Team, CloudGoat", depth: "P" },
          ],
        },
      ],
    },
    {
      order: 9,
      title: "Advanced Cloud Security",
      objective: "Operate at design level.",
      estimatedWeeks: 7,
      topics: [
        {
          title: "Multi-Cloud Security",
          objective: "Operate across cloud providers.",
          microtopics: [
            { title: "Identity federation across providers", depth: "P" },
            { title: "Workload identity federation, unified policy/CNAPP concepts", depth: "P" },
            { title: "Control equivalence and where it breaks", depth: "P" },
            { title: "Data residency, egress cost as security constraint", depth: "P" },
          ],
        },
        {
          title: "Zero Trust",
          objective: "Implement and evaluate Zero Trust architectures.",
          microtopics: [
            { title: "NIST SP 800-207 components, PEP/PDP", depth: "M" },
            { title: "Device and workload identity, microsegmentation", depth: "M" },
            { title: "Continuous verification, BeyondCorp-style proxies", depth: "M" },
            { title: "Service mesh mTLS, honest limits and failure modes", depth: "M" },
          ],
        },
        {
          title: "Cloud Threat Modelling",
          objective: "Apply threat modelling to cloud architectures.",
          microtopics: [
            { title: "Per-service trust boundaries", depth: "M" },
            { title: "Shared responsibility per service model", depth: "M" },
            { title: "Control-plane vs data-plane threats", depth: "M" },
            { title: "Tenant isolation, supply chain, cross-account trust graphs", depth: "M" },
            { title: "Attack-path analysis", depth: "M" },
          ],
        },
        {
          title: "Architecture Reviews",
          objective: "Conduct effective security design reviews.",
          microtopics: [
            { title: "Review methodology and checklists", depth: "M" },
            { title: "Blast-radius analysis and failure-mode reasoning", depth: "M" },
            { title: "Cost-of-control analysis and compensating controls", depth: "M" },
            { title: "Documenting residual risk and negotiating with teams", depth: "M" },
          ],
        },
        {
          title: "Resilience and Emerging",
          objective: "Build for failure and plan for the future.",
          microtopics: [
            { title: "Backup immutability, ransomware recovery", depth: "P" },
            { title: "Key-loss scenarios, region failure, break-glass procedures", depth: "P" },
            { title: "Post-quantum crypto migration, confidential computing", depth: "A" },
            { title: "Sovereign cloud requirements", depth: "A" },
          ],
        },
      ],
    },
  ];

  for (const phaseData of phases) {
    const phase = await prisma.roadmapPhase.create({
      data: {
        order: phaseData.order,
        title: phaseData.title,
        objective: phaseData.objective,
        estimatedWeeks: phaseData.estimatedWeeks,
        userId: owner.id,
        topics: {
          create: phaseData.topics.map((topic, topicIdx) => ({
            order: topicIdx,
            title: topic.title,
            objective: topic.objective,
            microtopics: {
              create: topic.microtopics.map((mt, mtIdx) => ({
                order: mtIdx,
                title: mt.title,
                depth: mt.depth,
              })),
            },
          })),
        },
      },
    });
  }

  console.log("Seeded database with roadmap data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });