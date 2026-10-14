/* ============================================================
   考研数学二 · 公式数据（数据与样式分离）
   覆盖：高等数学（数二范围）+ 线性代数
   tex   — KaTeX 源码（String.raw，勿改转义）
   cond  — 成立条件（纯文本）
   warn  — 易错提醒（纯文本）
   ============================================================ */
window.MATH2_DATA = {
  meta: {
    title: "考研数学二 · 公式大全",
    subtitle: "高等数学 · 线性代数",
    scope: "严格按数学二考试范围整理，不含无穷级数等超纲内容"
  },
  chapters: [
    /* ================= 高等数学 ================= */
    {
      id: "ga",
      title: "高等数学",
      sections: [
        {
          id: "ga1",
          title: "函数、极限与连续",
          items: [
            {
              id: "ga1-1",
              name: "常用等价无穷小（x→0）",
              tex: String.raw`\begin{aligned}
&\sin x \sim x,\quad \tan x \sim x,\quad \arcsin x \sim x,\quad \arctan x \sim x\\
&1-\cos x \sim \frac{x^2}{2},\quad \ln(1+x) \sim x,\quad e^x-1 \sim x\\
&a^x-1 \sim x\ln a\ (a>0,\ a\neq1),\quad (1+x)^\alpha-1 \sim \alpha x
\end{aligned}`,
              cond: "均在 x→0 时成立；更一般地，方框 □→0 时可将 □ 整体按上述替换",
              warn: "只可替换乘除因子；加减法中须整体等价，不可随意部分替换，否则易出错",
              kw: ["等价无穷小", "替换", "无穷小比较"]
            },
            {
              id: "ga1-2",
              name: "两个重要极限",
              tex: String.raw`\lim_{x\to0}\frac{\sin x}{x}=1,\qquad \lim_{x\to\infty}\left(1+\frac{1}{x}\right)^{x}=e=\lim_{x\to0}(1+x)^{\frac{1}{x}}`,
              cond: "第二式为 1^∞ 型；底数→1、指数→∞",
              warn: "一般 1^∞ 型：lim u^v = e^{lim v(u−1)}（需 u→1），先化成此形式再算",
              kw: ["重要极限", "e的定义", "1无穷"]
            },
            {
              id: "ga1-3",
              name: "洛必达法则",
              tex: String.raw`\lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)}`,
              cond: "① 为 0/0 或 ∞/∞ 未定式；② 在去心邻域内 f、g 可导且 g′(x)≠0；③ 右端极限存在（或为∞）",
              warn: "非未定式不能用；使用前先考虑等价无穷小、泰勒，避免盲目多次求导",
              kw: ["洛必达", "L'Hopital", "罗必塔", "未定式"]
            },
            {
              id: "ga1-4",
              name: "常用极限结论",
              tex: String.raw`\begin{aligned}
&\lim_{x\to0}\frac{\ln(1+x)}{x}=1,\quad \lim_{x\to0}\frac{e^x-1}{x}=1,\quad \lim_{x\to0}\frac{(1+x)^\alpha-1}{x}=\alpha\\
&\lim_{x\to+\infty}\frac{\ln x}{x^\alpha}=0\ (\alpha>0),\quad \lim_{x\to+\infty}\frac{x^\alpha}{e^x}=0,\quad \lim_{x\to+\infty}\frac{\sin x}{x}=0\\
&\lim_{n\to\infty}\sqrt[n]{n}=1,\quad \lim_{n\to\infty}\frac{a^n}{n!}=0,\quad \lim_{n\to\infty}\frac{n!}{n^n}=0\ (a>0)
\end{aligned}`,
              warn: "x→+∞ 时：对数 ≪ 幂 ≪ 指数，比较增长速度可直接得 0",
              kw: ["常用极限", "增长速度"]
            },
            {
              id: "ga1-5",
              name: "泰勒公式（x→0 常用展开）",
              tex: String.raw`\begin{aligned}
e^x&=1+x+\frac{x^2}{2!}+\cdots+\frac{x^n}{n!}+o(x^n)\\
\sin x&=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots+(-1)^{k-1}\frac{x^{2k-1}}{(2k-1)!}+o(x^{2k})\\
\cos x&=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots+(-1)^{k}\frac{x^{2k}}{(2k)!}+o(x^{2k+1})\\
\ln(1+x)&=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots+(-1)^{n-1}\frac{x^n}{n}+o(x^n)\\
(1+x)^\alpha&=1+\alpha x+\frac{\alpha(\alpha-1)}{2!}x^2+\cdots+\frac{\alpha(\alpha-1)\cdots(\alpha-n+1)}{n!}x^n+o(x^n)
\end{aligned}`,
              cond: "皮亚诺余项，x→0",
              warn: "展开阶数须与分母同阶（宁多保留一阶）；等价无穷小是泰勒的最低阶特例",
              kw: ["泰勒", "麦克劳林", "展开", "皮亚诺"]
            },
            {
              id: "ga1-6",
              name: "极限的四则运算",
              tex: String.raw`若\ \lim f=A,\ \lim g=B,\ 则\ \lim(f\pm g)=A\pm B,\ \lim(fg)=AB,\ \lim\frac{f}{g}=\frac{A}{B}\ (B\neq0)`,
              cond: "各项极限须分别存在；作商时分母极限非零",
              warn: "∞−∞、0·∞ 等未定式不能直接拆开，需先变形（通分、有理化、提最高阶）",
              kw: ["四则运算", "极限性质"]
            },
            {
              id: "ga1-7",
              name: "函数的连续与间断点分类",
              tex: String.raw`\begin{aligned}
&f在x_0连续\iff \lim_{x\to x_0}f(x)=f(x_0)\iff \lim_{\Delta x\to0}\Delta y=0\\
&\text{第一类（左右极限都存在）：可去间断点、跳跃间断点}\\
&\text{第二类（左右极限至少一个不存在）：无穷间断点、振荡间断点}
\end{aligned}`,
              warn: "分段函数的分段点必须用左右极限讨论；x₀ 无定义但极限存在 ⇒ 可去；左右极限都存在但不相等 ⇒ 跳跃",
              kw: ["连续", "间断点", "第一类", "第二类", "可去", "跳跃"]
            },
            {
              id: "ga1-8",
              name: "介值定理与零点定理",
              tex: String.raw`\begin{aligned}
&\text{零点定理：}f\in C[a,b],\ f(a)f(b)<0\Rightarrow \exists\,\xi\in(a,b),\ f(\xi)=0\\
&\text{介值定理：}f\in C[a,b],\ \eta\text{ 介于}f(a),f(b)\text{之间}\Rightarrow \exists\,\xi\in[a,b],\ f(\xi)=\eta\\
&\text{最值定理：}f\in C[a,b]\Rightarrow f\text{ 在}[a,b]\text{上有界且取得最大、最小值}
\end{aligned}`,
              cond: "f 在闭区间 [a,b] 上连续",
              warn: "证明“存在 ξ 使 f(ξ)=0”：先构造辅助函数，再用零点定理（注意验证端点异号）",
              kw: ["介值定理", "零点定理", "最值定理", "达布"]
            },
            {
              id: "ga1-9",
              name: "数列极限与函数极限的关系（归结原则）",
              tex: String.raw`\lim_{x\to x_0}f(x)=A\iff \text{对任意满足 }x_n\to x_0\ (x_n\neq x_0)\text{ 的数列，都有 }f(x_n)\to A`,
              warn: "证明极限不存在：找两个不同数列使函数值趋于不同结果（如 sin(1/x)）",
              kw: ["归结原则", "海涅", "数列极限"]
            }
          ]
        },
        {
          id: "ga2",
          title: "一元函数微分学",
          items: [
            {
              id: "ga2-1",
              name: "导数的定义",
              tex: String.raw`f'(x_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}`,
              cond: "该极限存在（左导数、右导数分别对应单侧极限）",
              warn: "分段函数分段点、含绝对值的零点必须用定义求导/判可导；连续是可导的必要条件",
              kw: ["导数定义", "可导", "左导数", "右导数"]
            },
            {
              id: "ga2-2",
              name: "可导、可微与连续的关系",
              tex: String.raw`\text{可导}\iff\text{可微（一元）},\qquad \text{可导}\Rightarrow\text{连续},\quad \text{连续}\nRightarrow\text{可导}`,
              warn: "反例：y=|x| 在 x=0 连续但不可导；多元函数可微⇒偏导存在⇒连续，均不可逆",
              kw: ["可微", "可导连续", "关系"]
            },
            {
              id: "ga2-3",
              name: "基本求导公式",
              tex: String.raw`\begin{aligned}
&(x^\mu)'=\mu x^{\mu-1},\quad (a^x)'=a^x\ln a,\quad (e^x)'=e^x,\quad (\log_a x)'=\frac{1}{x\ln a},\quad (\ln x)'=\frac1x\\
&(\sin x)'=\cos x,\quad (\cos x)'=-\sin x,\quad (\tan x)'=\sec^2x,\quad (\cot x)'=-\csc^2x\\
&(\sec x)'=\sec x\tan x,\quad (\csc x)'=-\csc x\cot x\\
&(\arcsin x)'=\frac{1}{\sqrt{1-x^2}},\quad (\arccos x)'=-\frac{1}{\sqrt{1-x^2}}\\
&(\arctan x)'=\frac{1}{1+x^2},\quad (\operatorname{arccot}x)'=-\frac{1}{1+x^2}
\end{aligned}`,
              warn: "反三角函数导数的负号：arccos、arccot；arcsin 定义域 |x|<1",
              kw: ["求导公式", "导数表", "基本公式"]
            },
            {
              id: "ga2-4",
              name: "四则运算与链式法则",
              tex: String.raw`\begin{aligned}
&(u\pm v)'=u'\pm v',\quad (uv)'=u'v+uv',\quad \left(\frac{u}{v}\right)'=\frac{u'v-uv'}{v^2}\\
&[f(\varphi(x))]'=f'(\varphi(x))\,\varphi'(x)
\end{aligned}`,
              warn: "复合函数由外向内逐层求导，中间层导数不能漏",
              kw: ["链式法则", "复合求导", "乘法法则"]
            },
            {
              id: "ga2-5",
              name: "反函数与隐函数求导",
              tex: String.raw`\begin{aligned}
&\text{反函数：}\frac{dy}{dx}=\frac{1}{\dfrac{dx}{dy}}\quad\left(\frac{dx}{dy}\neq0\right)\\
&\text{隐函数 }F(x,y)=0:\quad \frac{dy}{dx}=-\frac{F_x}{F_y}\quad(F_y\neq0)
\end{aligned}`,
              warn: "隐函数求导结果中可保留 y，通常需用原方程化简；别忘记 y 是 x 的函数",
              kw: ["反函数求导", "隐函数", "F_x", "F_y"]
            },
            {
              id: "ga2-6",
              name: "参数方程求导",
              tex: String.raw`\begin{aligned}
&x=x(t),\ y=y(t):\quad \frac{dy}{dx}=\frac{y'(t)}{x'(t)}\\
&\frac{d^2y}{dx^2}=\frac{d}{dt}\left(\frac{dy}{dx}\right)\Big/\frac{dx}{dt}=\frac{y''(t)x'(t)-y'(t)x''(t)}{[x'(t)]^3}
\end{aligned}`,
              cond: "x′(t)≠0",
              warn: "二阶导要再除一次 x′(t)——最常见错误",
              kw: ["参数方程", "参数求导", "二阶导"]
            },
            {
              id: "ga2-7",
              name: "对数求导法与幂指函数",
              tex: String.raw`\begin{aligned}
&y=y(x)>0:\quad y'=y\cdot(\ln y)'\\
&u(x)^{v(x)}=e^{v(x)\ln u(x)},\quad \left(u^{v}\right)'=u^{v}\left(v'\ln u+\frac{vu'}{u}\right)
\end{aligned}`,
              warn: "适用于幂指函数、多因子连乘除；先取对数再两边求导",
              kw: ["对数求导", "幂指函数", "u的v次方"]
            },
            {
              id: "ga2-8",
              name: "高阶导数常用公式",
              tex: String.raw`\begin{aligned}
&(e^{ax})^{(n)}=a^ne^{ax},\quad (\sin kx)^{(n)}=k^n\sin\left(kx+\frac{n\pi}{2}\right)\\
&(\cos kx)^{(n)}=k^n\cos\left(kx+\frac{n\pi}{2}\right),\quad (\ln x)^{(n)}=\frac{(-1)^{n-1}(n-1)!}{x^{n}}\\
&\left(\frac{1}{x-a}\right)^{(n)}=\frac{(-1)^n n!}{(x-a)^{n+1}},\quad (uv)^{(n)}=\sum_{k=0}^{n}\binom{n}{k}u^{(n-k)}v^{(k)}\ \text{（莱布尼茨公式）}
\end{aligned}`,
              warn: "求具体点 n 阶导可用泰勒展开对照系数；莱布尼茨中 u 一般取求导后能变简单的那个",
              kw: ["高阶导", "莱布尼茨", "n阶导", "递推"]
            },
            {
              id: "ga2-9",
              name: "微分与一阶形式不变性",
              tex: String.raw`dy=f'(x)dx;\qquad dy=f'(u)\,du\ \text{（无论 }u\text{ 是自变量还是中间变量）}`,
              warn: "形式不变性用于复合函数求微分与凑微分；dy 与 Δy 不相等，Δy 是实际增量",
              kw: ["微分", "形式不变性", "dy"]
            },
            {
              id: "ga2-10",
              name: "罗尔定理",
              tex: String.raw`f\in C[a,b],\ f\text{ 在 }(a,b)\text{ 内可导},\ f(a)=f(b)\Rightarrow\exists\,\xi\in(a,b),\ f'(\xi)=0`,
              cond: "连续、可导、端点值相等，三条件缺一不可",
              warn: "结论写开区间；证明题常先验证三条件再套定理",
              kw: ["罗尔", "Rolle", "中值定理"]
            },
            {
              id: "ga2-11",
              name: "拉格朗日中值定理",
              tex: String.raw`f\in C[a,b]\text{ 且在 }(a,b)\text{ 可导}\Rightarrow\exists\,\xi\in(a,b):\ f(b)-f(a)=f'(\xi)(b-a)`,
              cond: "闭区间连续、开区间可导",
              warn: "证明“存在 ξ”常用辅助函数 F(x)=f(x)−f(a)−[(f(b)−f(a))/(b−a)]·(x−a)，对 F 用罗尔",
              kw: ["拉格朗日", "Lagrange", "中值定理", "有限增量"]
            },
            {
              id: "ga2-12",
              name: "柯西中值定理",
              tex: String.raw`\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\xi)}{g'(\xi)},\qquad \xi\in(a,b)`,
              cond: "f、g 在 [a,b] 连续、(a,b) 可导，g′(x)≠0，g(b)≠g(a)",
              warn: "洛必达法则的理论基础；证明题中 g(x) 常取 x 等简单函数",
              kw: ["柯西", "Cauchy", "中值定理"]
            },
            {
              id: "ga2-13",
              name: "单调性判别",
              tex: String.raw`\text{在区间 }I\text{ 上：}f'(x)>0\Rightarrow f\nearrow;\qquad f'(x)<0\Rightarrow f\searrow`,
              warn: "划分区间的候选点：驻点、不可导点、定义域断点；f′≥0 且仅孤立点取 0 时仍严格增",
              kw: ["单调性", "增减", "判定"]
            },
            {
              id: "ga2-14",
              name: "极值的第一充分条件",
              tex: String.raw`f'(x_0)=0\text{ 或 }f'(x_0)\text{ 不存在，且 }f'\text{ 在 }x_0\text{ 两侧异号}\Rightarrow x_0\text{ 为极值点}\\
\text{左正右负}\Rightarrow\text{极大；左负右正}\Rightarrow\text{极小}`,
              warn: "不可导点也可能取极值（如 y=|x| 在 0 处取极小）",
              kw: ["极值", "第一充分条件", "判别"]
            },
            {
              id: "ga2-15",
              name: "极值的第二充分条件",
              tex: String.raw`f'(x_0)=0,\ f''(x_0)\text{ 存在}:\quad f''(x_0)<0\Rightarrow\text{极大值};\quad f''(x_0)>0\Rightarrow\text{极小值}`,
              cond: "f 在 x₀ 处二阶可导",
              warn: "f″(x₀)=0 时该法失效，改用第一充分条件或定义",
              kw: ["极值", "第二充分条件", "凹凸判定"]
            },
            {
              id: "ga2-16",
              name: "凹凸性与拐点",
              tex: String.raw`\begin{aligned}
&f''(x)>0\Rightarrow\text{曲线是凹的（开口向上）};\quad f''(x)<0\Rightarrow\text{曲线是凸的（开口向下）}\\
&\text{拐点：凹凸性发生改变的点 }(x_0,f(x_0))，\text{必要条件 }f''(x_0)=0\text{ 或不存在}
\end{aligned}`,
              warn: "拐点必须写坐标点 (x₀, f(x₀))；f″ 变号才是拐点，f″=0 只是必要条件",
              kw: ["凹凸", "拐点", "二阶导"]
            },
            {
              id: "ga2-17",
              name: "曲线的渐近线",
              tex: String.raw`\begin{aligned}
&\text{水平：}\lim_{x\to\pm\infty}f(x)=a\Rightarrow y=a\\
&\text{垂直：}\lim_{x\to x_0}f(x)=\infty\Rightarrow x=x_0\\
&\text{斜渐近线：}a=\lim_{x\to\pm\infty}\frac{f(x)}{x},\quad b=\lim_{x\to\pm\infty}\big(f(x)-ax\big)\Rightarrow y=ax+b
\end{aligned}`,
              warn: "斜渐近线的 a、b 必须取同一方向的极限，且该方向极限都存在",
              kw: ["渐近线", "水平", "垂直", "斜渐近线"]
            },
            {
              id: "ga2-18",
              name: "曲率与曲率半径",
              tex: String.raw`\begin{aligned}
&K=\frac{|y''|}{(1+y'^2)^{3/2}},\qquad \rho=\frac{1}{K}=\frac{(1+y'^2)^{3/2}}{|y''|}\\
&\text{参数式：}K=\frac{|x'y''-y'x''|}{(x'^2+y'^2)^{3/2}}
\end{aligned}`,
              cond: "y″≠0（否则曲率为 0、半径无穷大）",
              warn: "公式带绝对值，曲率非负；曲率中心 (x−y′(1+y′²)/y″,\ y+(1+y′²)/y″)",
              kw: ["曲率", "曲率半径", "曲率中心"]
            },
            {
              id: "ga2-19",
              name: "中值定理推论（恒等式证明）",
              tex: String.raw`f'(x)=0\ \text{在 }(a,b)\text{ 内恒成立}\Rightarrow f(x)\equiv C\ (x\in(a,b))`,
              warn: "证明 f(x)≡g(x)：令 F=f−g，证 F′≡0 且在一点取 0（或直接用区间上导数为 0）",
              kw: ["推论", "常数", "恒等式"]
            }
          ]
        },
        {
          id: "ga3",
          title: "一元函数积分学",
          items: [
            {
              id: "ga3-1",
              name: "不定积分的线性性质",
              tex: String.raw`\int[k_1f(x)+k_2g(x)]\,dx=k_1\int f(x)\,dx+k_2\int g(x)\,dx`,
              warn: "线性性质对加减与常数倍成立；f、g 的原函数族各自含一个任意常数（合并后仍为一个 C）",
              kw: ["不定积分", "线性"]
            },
            {
              id: "ga3-2",
              name: "基本积分表",
              tex: String.raw`\begin{aligned}
&\int x^\mu dx=\frac{x^{\mu+1}}{\mu+1}+C\ (\mu\neq-1),\qquad \int\frac{1}{x}dx=\ln|x|+C\\
&\int e^x dx=e^x+C,\qquad \int a^x dx=\frac{a^x}{\ln a}+C\\
&\int\sin x\,dx=-\cos x+C,\qquad \int\cos x\,dx=\sin x+C\\
&\int\sec^2x\,dx=\tan x+C,\qquad \int\csc^2x\,dx=-\cot x+C\\
&\int\sec x\tan x\,dx=\sec x+C,\qquad \int\csc x\cot x\,dx=-\csc x+C\\
&\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C,\qquad \int\frac{dx}{1+x^2}=\arctan x+C\\
&\int\frac{dx}{a^2+x^2}=\frac{1}{a}\arctan\frac{x}{a}+C,\qquad \int\frac{dx}{a^2-x^2}=\frac{1}{2a}\ln\left|\frac{a+x}{a-x}\right|+C\\
&\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac{x}{a}+C,\qquad \int\frac{dx}{x^2-a^2}=\frac{1}{2a}\ln\left|\frac{x-a}{x+a}\right|+C
\end{aligned}`,
              cond: "含 a 的式子默认 a>0；∫dx/x 记 ln|x|（勿漏绝对值）",
              warn: "∫1/x dx = ln|x|+C，x<0 时也成立；漏绝对值是高频失分点",
              kw: ["积分表", "基本积分", "原函数"]
            },
            {
              id: "ga3-3",
              name: "第一类换元法（凑微分）",
              tex: String.raw`\int f(\varphi(x))\varphi'(x)\,dx\ \xlongequal{\ u=\varphi(x)\ }\int f(u)\,du`,
              warn: "常用凑法：d(sin x)=cos x dx，d(ln x)=dx/x，d(eˣ)=eˣdx，d(xᵃ)=axᵃ⁻¹dx，d(tan x)=sec²x dx",
              kw: ["凑微分", "换元法", "第一类换元"]
            },
            {
              id: "ga3-4",
              name: "第二类换元法（三角代换）",
              tex: String.raw`\sqrt{a^2-x^2}\Rightarrow x=a\sin t;\qquad \sqrt{a^2+x^2}\Rightarrow x=a\tan t;\qquad \sqrt{x^2-a^2}\Rightarrow x=a\sec t`,
              cond: "a>0；t 的范围要使根式能开出来（回代时画辅助三角形最稳）",
              warn: "定积分换元必须同时换上下限；被积函数含 √(a²−x²) 时也可直接用几何意义（圆面积）",
              kw: ["三角代换", "第二类换元", "根式"]
            },
            {
              id: "ga3-5",
              name: "分部积分法",
              tex: String.raw`\int u\,dv=uv-\int v\,du`,
              warn: "选 u 优先级（口诀“反对幂指三”）：反三角、对数、幂函数、指数、三角；∫eᵃˣsin bx dx 型需两次分部后移项解出",
              kw: ["分部积分", "反对幂指三"]
            },
            {
              id: "ga3-6",
              name: "万能代换",
              tex: String.raw`t=\tan\frac{x}{2}:\quad \sin x=\frac{2t}{1+t^2},\quad \cos x=\frac{1-t^2}{1+t^2},\quad dx=\frac{2\,dt}{1+t^2}`,
              cond: "适用于 ∫R(sin x, cos x)dx 且其他方法困难时",
              warn: "代换后化为 t 的有理函数积分；计算量偏大，优先考虑凑微分",
              kw: ["万能代换", "半角", "三角有理式"]
            },
            {
              id: "ga3-7",
              name: "有理函数积分",
              tex: String.raw`\text{真分式：先拆部分分式}\quad \frac{P(x)}{(x-a)^k}\to\sum_{i=1}^{k}\frac{A_i}{(x-a)^i},\quad \frac{P(x)}{(x^2+px+q)^k}\to\sum\frac{M_ix+N_i}{(x^2+px+q)^i}`,
              cond: "x²+px+q 在实数域不可约（p²−4q<0）",
              warn: "分子次数 ≥ 分母时先做多项式除法；含 x²+px+q 的项分子设 Mx+N（不是常数）",
              kw: ["有理函数", "部分分式", "拆项"]
            },
            {
              id: "ga3-8",
              name: "牛顿-莱布尼茨公式",
              tex: String.raw`\int_a^b f(x)\,dx=F(b)-F(a),\qquad F'(x)=f(x)`,
              cond: "f 在 [a,b] 上连续（F 是它的一个原函数）",
              warn: "f 有间断点时须分段积分再相加，不能跨过间断点直接代入",
              kw: ["牛顿莱布尼茨", "N-L公式", "定积分"]
            },
            {
              id: "ga3-9",
              name: "定积分的性质",
              tex: String.raw`\begin{aligned}
&\int_a^b[f\pm g]=\int_a^b f\pm\int_a^b g,\qquad \int_a^b kf=k\int_a^b f,\qquad \int_a^b f=\int_a^c f+\int_c^b f\\
&f\le g\Rightarrow\int_a^b f\le\int_a^b g,\qquad \left|\int_a^b f\,dx\right|\le\int_a^b|f(x)|dx\\
&m(b-a)\le\int_a^b f\le M(b-a)\ \text{（}m,M\text{ 为最值）}
\end{aligned}`,
              warn: "估值定理、保号性是证明不等式的常用工具；|∫f| ≤ ∫|f| 方向别写反",
              kw: ["定积分性质", "估值", "保号性"]
            },
            {
              id: "ga3-10",
              name: "变上限积分求导",
              tex: String.raw`\begin{aligned}
&\frac{d}{dx}\int_a^x f(t)\,dt=f(x)\\
&\frac{d}{dx}\int_{\psi(x)}^{\varphi(x)}f(t)\,dt=f(\varphi(x))\varphi'(x)-f(\psi(x))\psi'(x)
\end{aligned}`,
              cond: "f 连续（含端点处的复合）",
              warn: "被积函数含 x（如 f(x,t)）时，须先把 x 换元提出或拆分，不能直接对被积函数求导",
              kw: ["变上限", "积分上限函数", "求导"]
            },
            {
              id: "ga3-11",
              name: "奇偶性与周期性",
              tex: String.raw`\begin{aligned}
&\int_{-a}^{a}f(x)dx=0\ (f\text{ 奇}),\qquad \int_{-a}^{a}f(x)dx=2\int_0^a f(x)dx\ (f\text{ 偶})\\
&f\text{ 以 }T\text{ 为周期}:\quad \int_a^{a+T}f(x)dx=\int_0^T f(x)dx
\end{aligned}`,
              cond: "奇偶性结论要求积分区间关于原点对称",
              warn: "对称区间先看奇偶性，能省大量计算；|x|、分段函数常先分段再去绝对值",
              kw: ["奇偶性", "周期", "对称区间"]
            },
            {
              id: "ga3-12",
              name: "点火公式（华里士公式）",
              tex: String.raw`\int_0^{\pi/2}\sin^nx\,dx=\int_0^{\pi/2}\cos^nx\,dx=\begin{cases}\dfrac{(n-1)!!}{n!!}\cdot\dfrac{\pi}{2}, & n\text{ 为偶数}\\[2mm] \dfrac{(n-1)!!}{n!!}, & n\text{ 为奇数}\end{cases}`,
              cond: "n 为正整数，区间 [0, π/2]",
              warn: "n!! 为双阶乘；∫₀^π sinⁿx dx = 2∫₀^{π/2} sinⁿx dx，而 ∫₀^π cosⁿx dx 不能直接加倍（奇数 n 时为 0）",
              kw: ["点火公式", "华里士", "Wallis", "递推"]
            },
            {
              id: "ga3-13",
              name: "反常积分与敛散性",
              tex: String.raw`\begin{aligned}
&\int_a^{+\infty}f(x)dx=\lim_{b\to+\infty}\int_a^b f(x)dx,\qquad \text{瑕点 }c:\ \int_a^c f=\lim_{\varepsilon\to0^+}\int_a^{c-\varepsilon}f\\
&\int_1^{+\infty}\frac{dx}{x^p}:\ p>1\text{ 收敛},\ p\le1\text{ 发散};\qquad \int_0^1\frac{dx}{x^p}:\ p<1\text{ 收敛},\ p\ge1\text{ 发散}
\end{aligned}`,
              cond: "计算反常积分必须用极限定义，不能直接代入 ∞",
              warn: "先找瑕点（分母零点、ln 的零点、根式端点），再用比较判别法或 p-积分判敛散",
              kw: ["反常积分", "瑕积分", "敛散", "p积分"]
            },
            {
              id: "ga3-14",
              name: "定积分求平面面积",
              tex: String.raw`\begin{aligned}
&\text{直角坐标：}S=\int_a^b|f(x)-g(x)|dx\\
&\text{极坐标：}S=\frac{1}{2}\int_\alpha^\beta\rho^2(\theta)\,d\theta
\end{aligned}`,
              warn: "先画图，确定上下（左右）曲线与交点；去绝对值必须分段",
              kw: ["面积", "平面图形", "极坐标面积"]
            },
            {
              id: "ga3-15",
              name: "旋转体体积",
              tex: String.raw`\begin{aligned}
&\text{绕 }x\text{ 轴（圆盘/垫圈法）：}V=\pi\int_a^b\big[f_{\text{外}}^2(x)-f_{\text{内}}^2(x)\big]dx\\
&\text{绕 }y\text{ 轴（柱壳法）：}V=2\pi\int_a^b x\,|f(x)|\,dx\\
&\text{绕直线 }x=L:\ \text{半径为 }|x-L|\ \text{（柱壳）或先平移再用垫圈法}
\end{aligned}`,
              warn: "垫圈法对 x 积分、绕 x 轴；柱壳法对 x 积分、绕 y 轴——“谁绕谁、壳半径是谁”要分清",
              kw: ["体积", "旋转体", "柱壳", "垫圈", "绕轴"]
            },
            {
              id: "ga3-16",
              name: "弧长与旋转曲面侧面积",
              tex: String.raw`\begin{aligned}
&L=\int_a^b\sqrt{1+y'^2}\,dx;\qquad \text{参数式：}L=\int_\alpha^\beta\sqrt{x'(t)^2+y'(t)^2}\,dt\\
&\text{极坐标：}L=\int_\alpha^\beta\sqrt{\rho^2(\theta)+\rho'(\theta)^2}\,d\theta\\
&S_{\text{侧}}=2\pi\int_a^b|y|\sqrt{1+y'^2}\,dx
\end{aligned}`,
              warn: "三个弧长公式都要开根号；侧面积比体积多乘 2πy（旋转半径）",
              kw: ["弧长", "侧面积", "旋转曲面"]
            },
            {
              id: "ga3-17",
              name: "函数的平均值",
              tex: String.raw`\bar{f}=\frac{1}{b-a}\int_a^b f(x)\,dx`,
              warn: "连续函数必在区间内取到平均值（介值性）",
              kw: ["平均值"]
            },
            {
              id: "ga3-18",
              name: "定积分定义求极限",
              tex: String.raw`\lim_{n\to\infty}\frac{b-a}{n}\sum_{i=1}^{n}f\left(a+\frac{b-a}{n}i\right)=\int_a^b f(x)\,dx;\qquad \lim_{n\to\infty}\frac1n\sum_{i=1}^nf\left(\frac{i}{n}\right)=\int_0^1 f(x)\,dx`,
              cond: "f 在相应区间上连续（或可积）",
              warn: "先把和式配成 (1/n)·Σf(i/n) 的标准形式，再识别被积函数与区间",
              kw: ["定积分定义", "和式极限", "黎曼和"]
            },
            {
              id: "ga3-19",
              name: "积分中值定理",
              tex: String.raw`\int_a^b f(x)dx=f(\xi)(b-a),\qquad \xi\in[a,b]`,
              cond: "f 在 [a,b] 上连续",
              warn: "与拉格朗日中值定理联用可证明积分不等式；ξ 是区间内的某点，不是任意点",
              kw: ["积分中值", "中值定理"]
            }
          ]
        },
        {
          id: "ga4",
          title: "多元函数微分学",
          items: [
            {
              id: "ga4-1",
              name: "偏导数的定义",
              tex: String.raw`f_x(x_0,y_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x},\qquad f_y(x_0,y_0)=\lim_{\Delta y\to0}\frac{f(x_0,y_0+\Delta y)-f(x_0,y_0)}{\Delta y}`,
              cond: "相应极限存在",
              warn: "求偏导时把其余自变量视为常数；分段函数在分段点必须用定义",
              kw: ["偏导数", "偏导", "定义"]
            },
            {
              id: "ga4-2",
              name: "全微分与可微的判定",
              tex: String.raw`\begin{aligned}
&z=f(x,y)\text{ 可微}\iff \Delta z=A\Delta x+B\Delta y+o(\rho),\quad A=f_x,\ B=f_y\\
&dz=f_x\,dx+f_y\,dy\\
&f_x,f_y\text{ 连续}\Rightarrow\text{可微}\Rightarrow\text{偏导存在}\Rightarrow\text{连续}
\end{aligned}`,
              cond: "其中 ρ=√(Δx²+Δy²)；偏导连续是可微的充分非必要条件",
              warn: "判断题高频：可微⇔偏导存在（一元）；多元中可微 ⇒ 偏导存在，反之不成立；偏导连续 ⇒ 可微，反之也不成立",
              kw: ["全微分", "可微", "判定", "关系"]
            },
            {
              id: "ga4-3",
              name: "多元复合函数链式法则",
              tex: String.raw`\begin{aligned}
&z=f(u,v),\ u=u(t),\ v=v(t):\quad \frac{dz}{dt}=f_u u'(t)+f_v v'(t)\\
&z=f(u,v),\ u=u(x,y),\ v=v(x,y):\quad \frac{\partial z}{\partial x}=f_u\frac{\partial u}{\partial x}+f_v\frac{\partial v}{\partial x}\\
&z=f(u,v),\ u=x+y,\ v=xy:\quad \frac{\partial z}{\partial x}=f_u+f_v\,y
\end{aligned}`,
              warn: "先画变量关系图，对每个自变量写出全部路径再相加；f_u、f_v 中的中间变量仍是 u、v",
              kw: ["链式法则", "复合函数", "多元求导"]
            },
            {
              id: "ga4-4",
              name: "由方程确定的隐函数求导",
              tex: String.raw`\begin{aligned}
&F(x,y)=0:\quad \frac{dy}{dx}=-\frac{F_x}{F_y}\quad(F_y\neq0)\\
&F(x,y,z)=0:\quad \frac{\partial z}{\partial x}=-\frac{F_x}{F_z},\qquad \frac{\partial z}{\partial y}=-\frac{F_y}{F_z}\quad(F_z\neq0)
\end{aligned}`,
              cond: "F 的偏导数连续且分母偏导非零（隐函数存在定理）",
              warn: "也可两边直接对 x 求导（z、y 视为 x 的函数）；两种方法结果应一致，可互验",
              kw: ["隐函数", "F_x", "F_z", "方程求导"]
            },
            {
              id: "ga4-5",
              name: "二元函数的极值（无条件）",
              tex: String.raw`\begin{aligned}
&\text{必要条件：}f_x(x_0,y_0)=f_y(x_0,y_0)=0\ (\text{驻点})\\
&A=f_{xx},\ B=f_{xy},\ C=f_{yy},\ \Delta=AC-B^2\\
&\Delta>0,\ A>0\Rightarrow\text{极小};\quad \Delta>0,\ A<0\Rightarrow\text{极大}\\
&\Delta<0\Rightarrow\text{非极值};\quad \Delta=0\text{ 失效（另作讨论）}
\end{aligned}`,
              cond: "f 的二阶偏导连续；A、B、C 均在驻点处取值",
              warn: "还要检查偏导不存在的点与边界点；实际应用题需比较驻点函数值与边界值（闭区域最值）",
              kw: ["极值", "驻点", "AC-B2", "判别法"]
            },
            {
              id: "ga4-6",
              name: "条件极值（拉格朗日乘数法）",
              tex: String.raw`L(x,y,\lambda)=f(x,y)+\lambda\,\varphi(x,y),\qquad \text{解}\ \begin{cases}L_x=f_x+\lambda\varphi_x=0\\L_y=f_y+\lambda\varphi_y=0\\L_\lambda=\varphi(x,y)=0\end{cases}`,
              cond: "约束条件 φ(x,y)=0；目标函数 f 在约束下求最值",
              warn: "λ 通常不必解出，联立消元后直接求 f 的最值；多元约束增加乘子个数",
              kw: ["拉格朗日", "条件极值", "乘数法", "约束"]
            },
            {
              id: "ga4-7",
              name: "方向导数与梯度",
              tex: String.raw`\begin{aligned}
&\frac{\partial f}{\partial l}=f_x\cos\alpha+f_y\cos\beta\quad(\text{方向角 }\alpha,\beta)\\
&\nabla f=(f_x,\ f_y),\qquad \max\frac{\partial f}{\partial l}=|\nabla f|=\sqrt{f_x^2+f_y^2}
\end{aligned}`,
              cond: "方向 l 为单位向量 (cosα, cosβ)；f 可微",
              warn: "方向导数最大值在梯度方向取到；梯度垂直于等值线（面）",
              kw: ["方向导数", "梯度", "nabla", "最速"]
            }
          ]
        },
        {
          id: "ga5",
          title: "二重积分",
          items: [
            {
              id: "ga5-1",
              name: "二重积分的性质",
              tex: String.raw`\begin{aligned}
&\iint_D(f\pm g)\,d\sigma=\iint_D f\,d\sigma\pm\iint_D g\,d\sigma,\qquad \iint_D kf\,d\sigma=k\iint_D f\,d\sigma\\
&f\le g\Rightarrow\iint_D f\,d\sigma\le\iint_D g\,d\sigma,\qquad \left|\iint_D f\,d\sigma\right|\le\iint_D|f|\,d\sigma\\
&\text{中值定理：}f\in C(D)\Rightarrow\iint_D f\,d\sigma=f(\xi,\eta)\cdot\sigma\ (\sigma\text{ 为区域面积})
\end{aligned}`,
              warn: "比较大小、估值定理是证明积分不等式的常用工具",
              kw: ["二重积分性质", "比较", "中值定理"]
            },
            {
              id: "ga5-2",
              name: "直角坐标下化为累次积分",
              tex: String.raw`\begin{aligned}
&X\text{ 型（先 }y\text{ 后 }x\text{）}:\ \iint_D f\,dxdy=\int_a^b dx\int_{\varphi_1(x)}^{\varphi_2(x)}f(x,y)\,dy\\
&Y\text{ 型（先 }x\text{ 后 }y\text{）}:\ \iint_D f\,dxdy=\int_c^d dy\int_{\psi_1(y)}^{\psi_2(y)}f(x,y)\,dx
\end{aligned}`,
              warn: "后积变量的限是常数，先积变量的限是函数；交换次序必须重新画图定限",
              kw: ["累次积分", "X型", "Y型", "交换次序"]
            },
            {
              id: "ga5-3",
              name: "极坐标计算二重积分",
              tex: String.raw`\iint_D f(x,y)\,dxdy=\iint_D f(\rho\cos\theta,\rho\sin\theta)\,\rho\,d\rho\,d\theta\\
\theta\in[\alpha,\beta],\ \rho\in[\rho_1(\theta),\rho_2(\theta)]\Rightarrow \int_\alpha^\beta d\theta\int_{\rho_1(\theta)}^{\rho_2(\theta)}f(\rho,\theta)\,\rho\,d\rho`,
              cond: "区域含圆、扇形或被积含 x²+y² 时优先极坐标",
              warn: "面积元素是 ρ dρ dθ——ρ 千万不能漏，这是最常见错误！",
              kw: ["极坐标", "换元", "rho", "极坐标二重积分"]
            },
            {
              id: "ga5-4",
              name: "对称性与轮换对称性",
              tex: String.raw`\begin{aligned}
&D\text{ 关于 }y\text{ 轴对称}:\ &f(-x,y)=-f(x,y)\Rightarrow\iint_D f=0;\ &f(-x,y)=f(x,y)\Rightarrow\iint_D f=2\iint_{D_{\text{右}}}f\\
&D\text{ 关于 }x\text{ 轴对称}:\ &f(x,-y)=-f(x,y)\Rightarrow\iint_D f=0;\ &f(x,-y)=f(x,y)\Rightarrow\iint_D f=2\iint_{D_{\text{上}}}f\\
&\text{轮换对称：}(x,y)\in D\Rightarrow(y,x)\in D:\quad \iint_D f(x,y)=\iint_D f(y,x)=\frac12\iint_D[f(x,y)+f(y,x)]
\end{aligned}`,
              warn: "用对称性先观察被积函数奇偶性，常可直接得 0 或简化一半区域",
              kw: ["对称性", "奇偶", "轮换对称"]
            },
            {
              id: "ga5-5",
              name: "二重积分计算的一般步骤",
              tex: String.raw`\text{画区域}\ \to\ \text{定类型与交点}\ \to\ \text{定上下（左右）限}\ \to\ \text{化累次积分}\ \to\ \text{逐次计算}`,
              warn: "被积函数含 |x−y|、max、分段时，须按分界线把 D 拆成若干子区域分别积分",
              kw: ["步骤", "计算方法", "分区域"]
            },
            {
              id: "ga5-6",
              name: "直角坐标与极坐标的互化",
              tex: String.raw`x=\rho\cos\theta,\quad y=\rho\sin\theta,\quad x^2+y^2=\rho^2,\quad dxdy=\rho\,d\rho\,d\theta`,
              warn: "圆域、扇形、含 x²+y² 的被积函数用极坐标；矩形域一般用直角坐标",
              kw: ["坐标互化", "代换"]
            }
          ]
        },
        {
          id: "ga6",
          title: "微分方程",
          items: [
            {
              id: "ga6-1",
              name: "基本概念：阶、通解与特解",
              tex: String.raw`n\text{ 阶方程的通解含 }n\text{ 个独立任意常数};\quad \text{代入初值条件 }y(x_0)=y_0\ \text{得特解}`,
              warn: "“通解”必须含 n 个独立常数；线性方程通解 = 对应齐次通解 + 非齐次特解",
              kw: ["概念", "通解", "特解", "阶"]
            },
            {
              id: "ga6-2",
              name: "可分离变量的方程",
              tex: String.raw`\frac{dy}{dx}=g(x)h(y)\ \Rightarrow\ \int\frac{dy}{h(y)}=\int g(x)\,dx+C`,
              cond: "h(y)≠0；h(y)=0 的常值函数也是解（勿丢根）",
              warn: "分离变量时两边同除 h(y) 可能丢解，最后检查是否漏了 y≡常数 的解",
              kw: ["可分离变量", "分离变量"]
            },
            {
              id: "ga6-3",
              name: "齐次方程",
              tex: String.raw`y'=\varphi\!\left(\frac{y}{x}\right):\ \text{令 }v=\frac{y}{x},\ y=vx,\ y'=v+x\frac{dv}{dx}\ \Rightarrow\ \frac{dv}{\varphi(v)-v}=\frac{dx}{x}`,
              cond: "右端为 y/x 的函数（零次齐次）",
              warn: "化为可分离变量后再积分；回代时把 v 换回 y/x",
              kw: ["齐次方程", "v=y/x"]
            },
            {
              id: "ga6-4",
              name: "一阶线性微分方程（通解公式）",
              tex: String.raw`y'+P(x)y=Q(x):\qquad y=e^{-\int P(x)dx}\left[\int Q(x)\,e^{\int P(x)dx}\,dx+C\right]`,
              cond: "P(x)、Q(x) 在区间 I 上连续；∫P(x)dx 不加任意常数",
              warn: "必须先化成标准型（y′ 系数为 1）；Q≡0 时为齐次，直接可分离",
              kw: ["一阶线性", "通解公式", "P(x)", "Q(x)"]
            },
            {
              id: "ga6-5",
              name: "线性微分方程解的结构",
              tex: String.raw`\begin{aligned}
&\text{若 }y^*\text{ 是非齐次方程的解，}\bar{y}\text{ 是对应齐次方程的解}\Rightarrow \bar{y}+y^*\text{ 仍是非齐次方程的解}\\
&\text{非齐次的通解}=\text{齐次通解}+\text{非齐次任一特解}\\
&\text{右端 }f=f_1+f_2\text{ 时，可分别求特解再叠加}
\end{aligned}`,
              warn: "两个非齐次特解之差是对应齐次方程的解（判断题常考）",
              kw: ["解的结构", "叠加", "齐次"]
            },
            {
              id: "ga6-6",
              name: "二阶常系数齐次线性方程",
              tex: String.raw`\begin{aligned}
&y''+py'+q=0,\quad \text{特征方程 }r^2+pr+q=0,\quad r_{1,2}=\frac{-p\pm\sqrt{p^2-4q}}{2}\\
&\Delta>0:\ y=C_1e^{r_1x}+C_2e^{r_2x}\\
&\Delta=0:\ y=(C_1+C_2x)e^{rx}\\
&\Delta<0:\ r=\alpha\pm\beta i,\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)
\end{aligned}`,
              cond: "p、q 为常数；三种情况由特征根类型决定",
              warn: "重根时必须乘 x，复根时 cos/sin 系数是 βx 而非 x；别背错结构",
              kw: ["二阶常系数", "特征方程", "特征根", "齐次"]
            },
            {
              id: "ga6-7",
              name: "高阶常系数齐次方程",
              tex: String.raw`\text{特征方程的根与通解结构：}\\
\begin{aligned}
&\text{单实根 }r \to e^{rx};\qquad k\text{ 重实根 }r \to (C_1+C_2x+\cdots+C_kx^{k-1})e^{rx}\\
&\text{共轭复根 }\alpha\pm\beta i \to e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)\ (\text{重根时乘 }x,\ x^2,\cdots)
\end{aligned}`,
              warn: "k 重根对应 k 个线性无关解，通解中任意常数个数必须等于方程阶数",
              kw: ["高阶", "特征根", "通解结构"]
            },
            {
              id: "ga6-8",
              name: "二阶常系数非齐次方程的特解（待定系数法）",
              tex: String.raw`\begin{aligned}
&f(x)=e^{\lambda x}P_m(x):\quad \tilde{y}=x^{s}Q_m(x)e^{\lambda x},\qquad s=\lambda\text{ 作为特征根的重数 }(0,1,2)\\
&f(x)=e^{\lambda x}\big[P_l(x)\cos\omega x+Q_n(x)\sin\omega x\big]:\\
&\qquad \tilde{y}=x^{s}e^{\lambda x}\big[R_m(x)\cos\omega x+S_m(x)\sin\omega x\big],\ m=\max(l,n)\\
&\qquad s=(\lambda+i\omega)\text{ 作为特征根的重数 }(0\text{ 或 }1)
\end{aligned}`,
              cond: "p、q 为常数；R_m、S_m 为待定的 m 次多项式（系数全要定）",
              warn: "s 只看 λ（或 λ+iω）是否为特征根，与右端项里有没有多项式无关；最终特解要代回原方程检验",
              kw: ["待定系数", "特解", "非齐次", "自由项", "lambda"]
            },
            {
              id: "ga6-9",
              name: "微分方程的简单应用（建模）",
              tex: String.raw`\begin{aligned}
&\text{冷却定律：}\frac{dT}{dt}=-k(T-T_0);\qquad \text{人口（增长）：}\frac{dy}{dt}=ky\\
&\text{几何：}\frac{dy}{dx}=\frac{\text{切线斜率条件}}{\text{由题意列出}};\qquad \text{一阶线性常见于变电阻充电、混合问题}
\end{aligned}`,
              warn: "步骤：设未知函数 → 根据题意列微分关系（微元法）→ 解方程 → 用初值定常数",
              kw: ["应用", "建模", "冷却", "几何应用"]
            }
          ]
        }
      ]
    },

    /* ================= 线性代数 ================= */
    {
      id: "la",
      title: "线性代数",
      sections: [
        {
          id: "la1",
          title: "行列式",
          items: [
            {
              id: "la1-1",
              name: "二阶与三阶行列式（沙路法）",
              tex: String.raw`\begin{vmatrix}a&b\\c&d\end{vmatrix}=ad-bc,\qquad \begin{vmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\\a_{31}&a_{32}&a_{33}\end{vmatrix}=a_{11}a_{22}a_{33}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}-a_{13}a_{22}a_{31}-a_{11}a_{23}a_{32}-a_{12}a_{21}a_{33}`,
              warn: "沙路法只适用于 2、3 阶行列式，高阶必须用定义、展开或性质",
              kw: ["沙路", "对角线", "二阶", "三阶"]
            },
            {
              id: "la1-2",
              name: "行列式的性质",
              tex: String.raw`\begin{aligned}
&(1)\ |A^T|=|A|;\quad (2)\ \text{两行（列）互换，行列式变号}\\
&(3)\ \text{某行（列）有公因子可提出};\quad (4)\ \text{两行（列）成比例或相同} \Rightarrow |A|=0\\
&(5)\ \text{某行（列）的 }k\text{ 倍加到另一行（列），值不变}\\
&(6)\ \text{上（下）三角行列式}=\text{对角元之积}
\end{aligned}`,
              warn: "“换行变号、倍乘提公因子”每次只对一次操作；倍加不变号",
              kw: ["性质", "行列式", "变换"]
            },
            {
              id: "la1-3",
              name: "行列式按行（列）展开",
              tex: String.raw`\begin{aligned}
&|A|=a_{i1}A_{i1}+a_{i2}A_{i2}+\cdots+a_{in}A_{in}\quad(\text{按第 }i\text{ 行展开})\\
&a_{j1}A_{i1}+a_{j2}A_{i2}+\cdots+a_{jn}A_{in}=0\quad(i\neq j)\\
&A_{ij}=(-1)^{i+j}M_{ij}
\end{aligned}`,
              cond: "A_ij 为代数余子式，M_ij 为余子式（去掉第 i 行第 j 列）",
              warn: "余子式 M 不带符号、代数余子式 A 带符号；异行乘同一代数余子式之和为 0（展开定理的推论，化简常用）",
              kw: ["展开", "代数余子式", "余子式", "展开定理"]
            },
            {
              id: "la1-4",
              name: "范德蒙德行列式",
              tex: String.raw`\begin{vmatrix}1&1&\cdots&1\\x_1&x_2&\cdots&x_n\\ \vdots&\vdots&&\vdots\\x_1^{\,n-1}&x_2^{\,n-1}&\cdots&x_n^{\,n-1}\end{vmatrix}=\prod_{1\le j<i\le n}(x_i-x_j)`,
              cond: "第 1 行全 1，第 k 行为 x 的 k−1 次幂；各 x_i 互不相等时行列式 ≠0",
              warn: "乘积顺序是 (x_i − x_j)（i>j），全部 x 相等时行列式为 0",
              kw: ["范德蒙德", "Vandermonde", "连乘"]
            },
            {
              id: "la1-5",
              name: "克拉默法则",
              tex: String.raw`Ax=b\ (n\text{ 个方程 }n\text{ 个未知数}),\ |A|\neq0\Rightarrow x_i=\frac{D_i}{D}\ (i=1,2,\dots,n)\\
D=|A|,\quad D_i\text{ 为把 }A\text{ 的第 }i\text{ 列换成 }b\text{ 所得行列式}`,
              cond: "|A|≠0（唯一解）；|A|=0 时不能用",
              warn: "实际求解用高斯消元更快；克拉默适合理论证明与小规模方程",
              kw: ["克拉默", "Cramer", "解方程"]
            },
            {
              id: "la1-6",
              name: "方阵乘积的行列式",
              tex: String.raw`|AB|=|A|\,|B|,\qquad |A^k|=|A|^k,\qquad |A^T|=|A|,\qquad |A^{-1}|=|A|^{-1},\qquad |kA|=k^n|A|`,
              cond: "A、B 为 n 阶方阵",
              warn: "|A+B| ≠ |A|+|B|；|kA| = kⁿ|A| 不是 k|A|——两个最高频错误",
              kw: ["乘积行列式", "kA", "行列式公式"]
            }
          ]
        },
        {
          id: "la2",
          title: "矩阵",
          items: [
            {
              id: "la2-1",
              name: "矩阵运算与转置（含逆）",
              tex: String.raw`\begin{aligned}
&(AB)^T=B^TA^T,\qquad (AB)^{-1}=B^{-1}A^{-1},\qquad (A^T)^{-1}=(A^{-1})^T\\
&(A+B)^T=A^T+B^T,\qquad (kA)^{-1}=k^{-1}A^{-1}\ (k\neq0)\\
&(AB)^k=A^kB^k\ \Leftrightarrow\ AB=BA\text{（一般不成立）}
\end{aligned}`,
              warn: "矩阵乘法不满足交换律；(A+B)⁻¹ ≠ A⁻¹+B⁻¹；转置/求逆都要“反序”",
              kw: ["转置", "逆", "运算", "反序"]
            },
            {
              id: "la2-2",
              name: "逆矩阵及其等价条件",
              tex: String.raw`\begin{aligned}
&AB=BA=E\Rightarrow A\text{ 可逆且 }B=A^{-1}\text{（唯一）}\\
&A\text{ 可逆}\iff|A|\neq0\iff r(A)=n\iff Ax=0\text{ 只有零解}\iff 0\text{ 不是 }A\text{ 的特征值}\\
&\text{伴随矩阵：}AA^*=A^*A=|A|E,\quad A^{-1}=\frac{A^*}{|A|}\ (|A|\neq0)
\end{aligned}`,
              cond: "A 为 n 阶方阵",
              warn: "伴随矩阵公式 (AB)*=B*A*（反序）、(kA)*=kⁿ⁻¹A*；|A*|=|A|ⁿ⁻¹（n≥2）",
              kw: ["逆矩阵", "可逆", "伴随", "等价条件"]
            },
            {
              id: "la2-3",
              name: "伴随矩阵的秩",
              tex: String.raw`r(A)=n\Rightarrow r(A^*)=n;\qquad r(A)=n-1\Rightarrow r(A^*)=1;\qquad r(A)<n-1\Rightarrow r(A^*)=0`,
              cond: "A 为 n 阶方阵，n≥2",
              warn: "由 |A*|=|A|ⁿ⁻¹ 与 AA*=|A|E 推出；判断题常考",
              kw: ["伴随", "秩", "r(A*)"]
            },
            {
              id: "la2-4",
              name: "初等变换与初等矩阵",
              tex: String.raw`\begin{aligned}
&\text{对 }A\text{ 施行初等行变换}=\text{左乘相应的初等矩阵；列变换=右乘}\\
&P^{-1}=P^T\ (\text{对换阵、倍乘阵});\quad \text{倍加阵的逆为反向倍加}\\
&A\text{ 可逆}\iff A\text{ 可表为若干初等矩阵之积}
\end{aligned}`,
              warn: "只有三种初等变换（互换、某行乘 k、某行加另一行的 k 倍）；求秩用行变换化阶梯形",
              kw: ["初等变换", "初等矩阵", "阶梯形"]
            },
            {
              id: "la2-5",
              name: "矩阵的秩",
              tex: String.raw`\begin{aligned}
&0\le r(A_{m\times n})\le\min\{m,n\},\qquad r(A^T)=r(A)\\
&r(AB)\le\min\{r(A),r(B)\},\qquad r(A+B)\le r(A)+r(B)\\
&A\text{ 可逆}\Rightarrow r(AB)=r(BA)=r(B),\qquad |A|\neq0\iff r(A)=n
\end{aligned}`,
              warn: "秩不等式方向是 ≤；A 可逆才保证乘积秩不变，反之不成立",
              kw: ["秩", "rank", "不等式", "满秩"]
            },
            {
              id: "la2-6",
              name: "矩阵的等价",
              tex: String.raw`A,B\text{ 为同型矩阵}:\quad A\text{ 与 }B\text{ 等价}\iff r(A)=r(B)\iff \exists\,P,Q\text{ 可逆},\ B=PAQ`,
              warn: "等价只要求同型、同秩；与相似、合同是不同概念（三者关系是常考判断题）",
              kw: ["等价", "同型", "PAQ"]
            },
            {
              id: "la2-7",
              name: "分块矩阵",
              tex: String.raw`\begin{aligned}
&\text{分块乘法按普通乘法法则（块维数须匹配）}\\
&\begin{pmatrix}A&O\\O&B\end{pmatrix}^{-1}=\begin{pmatrix}A^{-1}&O\\O&B^{-1}\end{pmatrix},\qquad \begin{vmatrix}A&O\\O&B\end{vmatrix}=|A|\,|B|,\qquad \begin{vmatrix}A&C\\O&B\end{vmatrix}=|A|\,|B|
\end{aligned}`,
              cond: "A、B 为方块（求逆、取行列式时）",
              warn: "准上（下）三角分块行列式 = 对角块行列式之积；分块乘法不满足交换律",
              kw: ["分块", "准对角", "分块矩阵"]
            },
            {
              id: "la2-8",
              name: "矩阵方程",
              tex: String.raw`AX=B\Rightarrow X=A^{-1}B;\qquad XA=B\Rightarrow X=BA^{-1};\qquad AXB=C\Rightarrow X=A^{-1}CB^{-1}`,
              cond: "涉及的矩阵均可逆（A、B 可逆）",
              warn: "矩阵不能像数一样“除”；注意左乘还是右乘——乘反是最常见错误",
              kw: ["矩阵方程", "AX=B", "解X"]
            },
            {
              id: "la2-9",
              name: "方阵的幂与矩阵多项式",
              tex: String.raw`A=P\Lambda P^{-1}\Rightarrow A^k=P\Lambda^kP^{-1};\qquad \varphi(A)=P\varphi(\Lambda)P^{-1}`,
              cond: "A 可对角化（有 n 个线性无关特征向量）",
              warn: "不可对角化时 A^k 不能用此法；另外 A²−A=0 类题可凑 A(A−E)=0 或找规律",
              kw: ["矩阵幂", "A^n", "对角化求幂"]
            }
          ]
        },
        {
          id: "la3",
          title: "向量",
          items: [
            {
              id: "la3-1",
              name: "线性组合与线性表示",
              tex: String.raw`\beta=k_1\alpha_1+k_2\alpha_2+\cdots+k_s\alpha_s\ \Rightarrow\ \beta\text{ 可由向量组 }\alpha_1,\dots,\alpha_s\text{ 线性表示}`,
              warn: "β 可由 α 组表出 ⇔ 方程组 x₁α₁+…+xₛαₛ=β 有解 ⇔ r(A)=r(A|β)",
              kw: ["线性组合", "线性表示", "表出"]
            },
            {
              id: "la3-2",
              name: "线性相关与无关的定义",
              tex: String.raw`\begin{aligned}
&k_1\alpha_1+\cdots+k_s\alpha_s=0\text{ 仅当 }k_1=\cdots=k_s=0\text{ 时成立}\iff\text{线性无关}\\
&\text{存在不全为零的 }k_1,\dots,k_s\text{ 使上式成立}\iff\text{线性相关}
\end{aligned}`,
              warn: "定义式右端必须是零向量；“有不全为零的系数使和为零”才是相关——字眼别看反",
              kw: ["线性相关", "线性无关", "定义"]
            },
            {
              id: "la3-3",
              name: "线性相关性的常用结论",
              tex: String.raw`\begin{aligned}
&\text{部分相关}\Rightarrow\text{整体相关};\qquad \text{整体无关}\Rightarrow\text{任一部分无关}\\
&\text{向量个数}>\text{维数}\Rightarrow\text{必相关};\qquad \text{含零向量或两向量成比例}\Rightarrow\text{相关}\\
&\alpha_1,\dots,\alpha_s\text{ 线性无关}\iff\text{以它们为列的矩阵 }r(A)=s\ (\text{列满秩})
\end{aligned}`,
              warn: "无关的向量组，乘非零常数后仍无关；相关组加一个向量的结论要小心（不能瞎推）",
              kw: ["相关性", "结论", "判定", "个数维数"]
            },
            {
              id: "la3-4",
              name: "极大线性无关组与向量组的秩",
              tex: String.raw`\begin{aligned}
&\text{向量组的秩}=\text{极大无关组所含向量个数}=\text{该组构成矩阵的秩}\\
&\text{两向量组等价}\iff\text{秩相等且互相线性表示}
\end{aligned}`,
              warn: "秩相等只是必要条件：若 β 组可由 α 组线性表示且 r(β)=r(α)，才能推出等价",
              kw: ["极大无关组", "向量组的秩", "等价"]
            },
            {
              id: "la3-5",
              name: "内积、长度与正交",
              tex: String.raw`(\alpha,\beta)=\alpha^T\beta=\sum_{i}a_ib_i,\qquad \|\alpha\|=\sqrt{(\alpha,\alpha)},\qquad \alpha\perp\beta\iff(\alpha,\beta)=0\\
\text{单位化：}e=\frac{\alpha}{\|\alpha\|}\ (\alpha\neq0)`,
              warn: "正交 ⇒ 内积为 0 ⇒ 线性无关（非零向量）；计算内积是逐分量相乘再求和",
              kw: ["内积", "正交", "单位化", "长度"]
            },
            {
              id: "la3-6",
              name: "施密特正交化",
              tex: String.raw`\begin{aligned}
&\beta_1=\alpha_1,\qquad \beta_2=\alpha_2-\frac{(\alpha_2,\beta_1)}{(\beta_1,\beta_1)}\beta_1\\
&\beta_3=\alpha_3-\frac{(\alpha_3,\beta_1)}{(\beta_1,\beta_1)}\beta_1-\frac{(\alpha_3,\beta_2)}{(\beta_2,\beta_2)}\beta_2
\end{aligned}`,
              cond: "α₁,…,αₙ 线性无关；正交化后再单位化得标准正交基",
              warn: "分母是已正交化的 (βⱼ,βⱼ)，分子是 (αᵢ,βⱼ)；投影系数写反是高频错误",
              kw: ["施密特", "正交化", "Schmidt"]
            },
            {
              id: "la3-7",
              name: "正交矩阵",
              tex: String.raw`\begin{aligned}
&Q\text{ 正交}\iff Q^TQ=E\iff Q^{-1}=Q^T\iff \text{列（行）向量组为标准正交组}\\
&|Q|=\pm1,\qquad r(Q)=n,\qquad Q\text{ 正交}\Rightarrow \|Qx\|=\|x\|\ (\text{保长度与夹角})
\end{aligned}`,
              cond: "Q 为 n 阶方阵",
              warn: "正交矩阵的乘积仍正交；正交变换不改变向量长度——这是二次型正交化的几何意义",
              kw: ["正交矩阵", "Q^TQ", "标准正交"]
            }
          ]
        },
        {
          id: "la4",
          title: "线性方程组",
          items: [
            {
              id: "la4-1",
              name: "齐次线性方程组解的判定",
              tex: String.raw`\begin{aligned}
&Ax=0\text{ 有非零解}\iff r(A)<n\ (n\text{ 为未知数个数，即 }A\text{ 的列数})\\
&Ax=0\text{ 只有零解}\iff r(A)=n\\
&\text{基础解系含 }n-r(A)\text{ 个解向量};\quad \text{通解 }x=k_1\xi_1+\cdots+k_{n-r}\xi_{n-r}
\end{aligned}`,
              cond: "齐次方程组总有零解；n = 未知数个数",
              warn: "自由变量个数 = n − r(A) = 基础解系向量个数；写通解时 kᵢ 为任意常数",
              kw: ["齐次", "基础解系", "非零解", "通解"]
            },
            {
              id: "la4-2",
              name: "非齐次线性方程组解的判定",
              tex: String.raw`\begin{aligned}
&Ax=b\text{ 有解}\iff r(A)=r(\bar A)\ (\bar A=(A|b))\\
&\text{唯一解}\iff r(A)=r(\bar A)=n;\qquad \text{无穷多解}\iff r(A)=r(\bar A)<n\\
&\text{无解}\iff r(A)<r(\bar A)
\end{aligned}`,
              warn: "先比较 r(A) 与 r(A|b)，再与 n 比较；只算 r(A) 不够，必须带增广矩阵",
              kw: ["非齐次", "判定", "增广矩阵", "唯一解", "无解"]
            },
            {
              id: "la4-3",
              name: "解的性质与通解结构",
              tex: String.raw`\begin{aligned}
&x_1,x_2\text{ 为 }Ax=b\text{ 的解}\Rightarrow x_1-x_2\text{ 为 }Ax=0\text{ 的解}\\
&x^*\text{ 为非齐次特解},\ x_h\text{ 为齐次通解}\Rightarrow x=x^*+x_h\text{ 为非齐次通解}\\
&\text{无穷多解时：通解}=\text{一个特解}+\text{对应齐次通解}
\end{aligned}`,
              warn: "非齐次解的线性组合一般不再是解（系数和为 1 才是）；两特解之差是齐次解",
              kw: ["解的结构", "通解", "特解", "叠加"]
            },
            {
              id: "la4-4",
              name: "求解线性方程组的步骤",
              tex: String.raw`\bar A\xrightarrow{\text{初等行变换}}\text{阶梯形}\ \to\ \text{判 }r(A),r(\bar A)\ \to\ \text{回代，自由变量作参数}\ \to\ \text{写出通解}`,
              warn: "只能用行变换（不能动列）；同解变形保证解集不变；结果代回原方程检验",
              kw: ["高斯消元", "步骤", "行变换"]
            }
          ]
        },
        {
          id: "la5",
          title: "特征值与特征向量",
          items: [
            {
              id: "la5-1",
              name: "特征值与特征向量的定义",
              tex: String.raw`A\xi=\lambda\xi,\qquad \xi\neq0`,
              cond: "A 为 n 阶方阵，λ 为特征值，ξ 为对应的非零特征向量",
              warn: "特征向量必须是非零向量；零向量不是特征向量",
              kw: ["特征值", "特征向量", "定义", "Axi=λxi"]
            },
            {
              id: "la5-2",
              name: "特征值与特征向量的求法",
              tex: String.raw`|\lambda E-A|=0\ \Rightarrow\ \text{得特征值 }\lambda_1,\dots,\lambda_n;\qquad (\lambda E-A)x=0\ \Rightarrow\ \text{得特征向量}`,
              cond: "|λE−A| 是 n 次多项式（特征多项式），恰有 n 个特征值（含重根）",
              warn: "行列式用 |λE−A|（习惯统一）；每个 λ 求出的是全部对应特征向量（基础解系的非零线性组合）",
              kw: ["特征多项式", "求法", "lambdaE-A"]
            },
            {
              id: "la5-3",
              name: "特征值的性质",
              tex: String.raw`\begin{aligned}
&\sum_{i=1}^{n}\lambda_i=\operatorname{tr}(A)=\sum_{i=1}^n a_{ii},\qquad \prod_{i=1}^{n}\lambda_i=|A|\\
&A\text{ 可逆}\iff\lambda_i\neq0\ (\forall i);\qquad A^{-1}\text{ 的特征值为 }\lambda_i^{-1}\\
&A\xi=\lambda\xi\Rightarrow A^k\xi=\lambda^k\xi,\quad \varphi(A)\xi=\varphi(\lambda)\xi\\
&\text{相似矩阵有相同的特征值、迹、行列式、秩}
\end{aligned}`,
              warn: "特征值之和 = 迹（主对角元之和）——不用解方程就能得和；|A| = 特征值之积",
              kw: ["性质", "迹", "行列式积", "特征值和"]
            },
            {
              id: "la5-4",
              name: "矩阵可对角化",
              tex: String.raw`\begin{aligned}
&A\sim\Lambda\iff A\text{ 有 }n\text{ 个线性无关的特征向量}\\
&\lambda\text{ 为 }k\text{ 重特征值}\Rightarrow\text{至少有 }k\text{ 个线性无关特征向量才可对角化（几何重数=代数重数）}\\
&A=P\Lambda P^{-1}\Rightarrow A^k=P\Lambda^kP^{-1},\qquad \Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n)
\end{aligned}`,
              warn: "可对角化不是必然：n 重特征值只有 1 个无关特征向量时不可对角化；不同特征值的特征向量必线性无关",
              kw: ["对角化", "相似", "Λ", "P"]
            },
            {
              id: "la5-5",
              name: "实对称矩阵的特征值与特征向量",
              tex: String.raw`\begin{aligned}
&A^T=A\Rightarrow:\ \text{特征值全为实数};\ \text{不同特征值的特征向量正交}\\
&\text{必存在正交矩阵 }Q:\ Q^{-1}AQ=Q^TAQ=\Lambda\ (\text{正交相似对角化})
\end{aligned}`,
              cond: "A 为实对称矩阵",
              warn: "重特征值对应的特征向量需先施密特正交化再单位化，不能直接拼成 Q 的列",
              kw: ["实对称", "正交对角化", "对称阵"]
            },
            {
              id: "la5-6",
              name: "用正交变换化对角化的步骤",
              tex: String.raw`|\lambda E-A|=0\ \text{求特征值}\ \to\ \text{解 }(\lambda E-A)x=0\ \text{求特征向量}\ \to\ \text{重根施密特正交化}\ \to\ \text{单位化得 }Q`,
              warn: "Q 的列顺序必须与 Λ 中特征值顺序一致；检验：QᵀAQ 应为对角阵",
              kw: ["正交变换", "步骤", "Q^TAQ"]
            }
          ]
        },
        {
          id: "la6",
          title: "二次型",
          items: [
            {
              id: "la6-1",
              name: "二次型及其矩阵表示",
              tex: String.raw`f(x_1,\dots,x_n)=\sum_{i=1}^n\sum_{j=1}^n a_{ij}x_ix_j\ (a_{ij}=a_{ji})=X^TAX,\qquad A=A^T`,
              cond: "A 为对称矩阵（二次型与对称矩阵一一对应）",
              warn: "交叉项 xᵢxⱼ 的系数 aᵢⱼ=aⱼᵢ 各占一半（对称化）；矩阵必须写成对称阵",
              kw: ["二次型", "矩阵表示", "对称矩阵"]
            },
            {
              id: "la6-2",
              name: "合同变换与标准形",
              tex: String.raw`\begin{aligned}
&x=Cy\ (C\text{ 可逆})\ \Rightarrow\ f=y^T(C^TAC)y,\quad B=C^TAC\text{（}A\text{ 与 }B\text{ 合同）}\\
&f=\sum_{i=1}^n d_iy_i^2\ \text{称为标准形（平方和，无交叉项）}
\end{aligned}`,
              cond: "C 可逆（合同变换保持秩与正负惯性指数）",
              warn: "合同强调 CᵀAC，相似强调 P⁻¹AP——两者不同；实对称阵正交相似 ⇔ 正交合同",
              kw: ["合同", "标准形", "惯性", "x=Cy"]
            },
            {
              id: "la6-3",
              name: "惯性定理与规范形",
              tex: String.raw`\text{标准形中正项个数 }p\text{ 与负项个数 }q\text{ 由 }f\text{ 唯一确定（惯性定理）};\\ \text{规范形}=p\text{ 个 }+1,\ q\text{ 个 }-1,\ n-p-q\text{ 个 }0`,
              cond: "在任何可逆线性变换下 p、q 不变",
              warn: "p、q 与所用变换无关，但标准形的具体系数不唯一（只有 p、q 不变）",
              kw: ["惯性定理", "正惯性指数", "负惯性指数", "规范形"]
            },
            {
              id: "la6-4",
              name: "化二次型为标准形的方法",
              tex: String.raw`\begin{aligned}
&\text{正交变换法：求 }A\text{ 的特征值}\Rightarrow f=\lambda_1y_1^2+\cdots+\lambda_ny_n^2\ (\text{系数为特征值，保长度})\\
&\text{配方法（拉格朗日）：逐个变量配方，适合任意二次型}
\end{aligned}`,
              warn: "正交变换得到的系数恰为特征值；配方法系数一般不是特征值，但正负惯性指数相同",
              kw: ["正交变换", "配方法", "标准形方法"]
            },
            {
              id: "la6-5",
              name: "二次型的正定性判定",
              tex: String.raw`\begin{aligned}
&f\text{ 正定}\iff\forall X\neq0,\ f>0\iff\text{所有特征值}>0\iff\text{正惯性指数}=n\\
&\iff\text{所有顺序主子式}>0\iff A\sim E\iff A=P^TP\ (P\text{ 可逆})\\
&\text{负定}\iff\text{奇数阶顺序主子式}<0\text{ 且偶数阶顺序主子式}>0\ (\text{或特征值全}<0)
\end{aligned}`,
              warn: "判正定只需算顺序主子式全 > 0（不必算全部主子式）；必要条件 aᵢᵢ>0、|A|>0 可先快速排除",
              kw: ["正定", "顺序主子式", "负定", "判定"]
            },
            {
              id: "la6-6",
              name: "正定矩阵的性质",
              tex: String.raw`\text{若 }A\text{ 正定}:\ |A|>0,\ a_{ii}>0,\ A\text{ 可逆且 }A^{-1}\text{ 正定},\ A^k\text{ 正定},\ A\text{ 的特征值全}>0`,
              warn: "正定阵必可逆；A、B 正定时 A+B 正定，但 AB 不一定正定（除非可交换）",
              kw: ["正定性质", "可逆", "特征值"]
            }
          ]
        }
      ]
    }
  ]
};

