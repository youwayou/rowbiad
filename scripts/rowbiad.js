document.addEventListener('DOMContentLoaded', () => {
    // Entry overlays and forms
    const entryOverlay = document.getElementById('entry-overlay');
    const entryStudentBtn = document.getElementById('entry-student-btn');
    const entryLecturerBtn = document.getElementById('entry-lecturer-btn');
    const entryAdminBtn = document.getElementById('entry-admin-btn');

    const adminLoginOverlay = document.getElementById('admin-login-overlay');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminBackBtn = document.getElementById('admin-back-btn');
    const adminDashboard = document.getElementById('admin-dashboard');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const payoutList = document.getElementById('payout-list');

    const lecturerSignupOverlay = document.getElementById('lecturer-signup-overlay');
    const lecturerSignupForm = document.getElementById('lecturer-signup-form');
    const lecturerNameSignup = document.getElementById('lecturer-name-signup');
    const classSubjectInput = document.getElementById('class-subject');
    const classFeeInput = document.getElementById('class-fee');

    const linkShareScreen = document.getElementById('link-share-screen');
    const lecturerWelcomeMessage = document.getElementById('lecturer-welcome-message');
    const classLinkInput = document.getElementById('class-link-input');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const startClassBtn = document.getElementById('start-class-btn');
    const shareLinkBtn = document.getElementById('share-link-btn');
    const whatsappShareBtnSetup = document.getElementById('whatsapp-share-btn-setup');

    const paymentOverlay = document.getElementById('payment-overlay');
    const paymentForm = document.getElementById('payment-form');
    const payButton = document.getElementById('pay-button');
    const paymentStatus = document.getElementById('payment-status');
    const paymentAmountDisplay = document.getElementById('payment-amount');
    const paymentInstruction = document.getElementById('payment-instruction');
    const paymentLogo = document.getElementById('payment-method-logo');
    const paymentLogoFallbackText = document.getElementById('payment-method-logo-text');
    const paymentMethodButtons = Array.from(document.querySelectorAll('.payment-method-btn'));
    const paymentSections = document.querySelectorAll('.payment-method-section');
    const paymentMethodMetadata = {
        momo: {
            name: 'MTN MoMo',
            buttonSuffix: 'via MTN MoMo',
            instruction: 'Authorize the MTN MoMo prompt that will appear on your phone',
            logoSrc: 'https://logovector.net/wp-content/uploads/2021/02/mtn-momo-logo-logovector.png',
            logoAlt: 'MTN MoMo logo',
            logoFallback: 'MTN MoMo'
        },
        vodafone: {
            name: 'Vodafone Cash',
            buttonSuffix: 'via Vodafone Cash',
            instruction: 'Enter your Vodafone Cash PIN when prompted to approve the payment',
            logoSrc: 'https://cdnlogo.com/logos/v/86/vodafone.svg',
            logoAlt: 'Vodafone Cash logo',
            logoFallback: 'Vodafone'
        },
        card: {
            name: 'Debit/Credit Card',
            buttonSuffix: 'with Card',
            instruction: 'Enter your card details securely to process the payment',
            logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Credit_card_font_awesome.svg/512px-Credit_card_font_awesome.svg.png',
            logoAlt: 'Card payment icon',
            logoFallback: 'Card'
        }
    };

    function updatePaymentSummary() {
        const amount = Number.isFinite(currentClassFee) ? currentClassFee : 0;
        const metadata = paymentMethodMetadata[currentPaymentMethod];
        const suffix = metadata?.buttonSuffix ? ` ${metadata.buttonSuffix}` : '';

        if (paymentAmountDisplay) {
            paymentAmountDisplay.textContent = `GHS ${amount.toFixed(2)}`;
        }

        if (payButton) {
            if (amount === 0) {
                payButton.textContent = `Join Class${suffix}`;
            } else {
                payButton.textContent = `Pay GHS ${amount.toFixed(2)}${suffix}`;
            }
        }
    }

    const defaultPaymentInstruction = paymentInstruction.textContent;
    const momoNumberInput = document.getElementById('momo-number');
    const vodafoneNumberInput = document.getElementById('vodafone-number');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');
    const cardNameInput = document.getElementById('card-name');

    const appContainer = document.getElementById('app-container');
    const logoutBtn = document.getElementById('logout-btn');
    const userVideo = document.getElementById('user-video');
    const lecturerVideo = document.getElementById('lecturer-video');
    const userCamOffPlaceholder = document.getElementById('user-cam-off-placeholder');
    const lecturerCamOffPlaceholder = document.getElementById('lecturer-cam-off-placeholder');
    const lecturerNameDisplay = document.getElementById('lecturer-name-display');
    const participantsGrid = document.getElementById('participants-grid');
    const participantCount = document.getElementById('participant-count');

    const studentPanel = document.getElementById('student-panel');
    const lecturerAssignmentPanel = document.getElementById('lecturer-assignment-panel');
    const lecturerControls = document.getElementById('lecturer-controls');

    const assignmentForm = document.getElementById('assignment-form');
    const assignmentFileInput = document.getElementById('assignment-file');
    const assignmentsList = document.getElementById('assignments-list');
    const assignmentStatusMsg = document.getElementById('assignment-status-msg');

    const openFileBtn = document.getElementById('open-file-btn');
    const fileInput = document.getElementById('file-input');

    // Whiteboard elements
    const whiteboardContent = document.getElementById('whiteboard-content');
    const whiteboardCanvas = document.getElementById('whiteboard-canvas');
    const studentWhiteboardCanvas = document.getElementById('student-whiteboard-canvas');
    const drawingToolbar = document.getElementById('drawing-toolbar');
    const colorPicker = document.getElementById('color-picker');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const clearConfirmOverlay = document.getElementById('clear-confirm-overlay');
    const confirmClearBtn = document.getElementById('confirm-clear-btn');
    const cancelClearBtn = document.getElementById('cancel-clear-btn');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const studentWhiteboardControls = document.getElementById('student-whiteboard-controls');
    const studentDrawBtn = document.getElementById('student-draw-btn');
    const undoContainer = document.getElementById('undo-container');
    const undoBtn = document.getElementById('undo-btn');

    // Footer Controls
    const toggleMicBtn = document.getElementById('toggle-mic');
    const toggleCameraBtn = document.getElementById('toggle-camera');
    const recordBtn = document.getElementById('record-btn');
    const raiseHandBtn = document.getElementById('raise-hand');
    const endCallBtn = document.getElementById('end-call');
    const recordingIndicator = document.getElementById('recording-indicator');

    // --- State ---
    let currentUserRole = 'student';
    let currentClassSubject = '';
    let currentClassFee = 0;
    let currentSessionId = '';
    let currentPaymentMethod = 'momo';
    let isDrawing = false;
    let currentTool = 'pen';
    let lastX = 0, lastY = 0;
    let submittedAssignments = [];
    let isMicOn = true, isCameraOn = true, isRecording = false, isHandRaised = false;
    let tempTextInput = null;
    let whiteboardHistory = [];
    let mediaRecorder;
    let recordedChunks = [];

    const lecturerData = [
        { id: 1, name: 'Dr. Evelyn Reed', earnings: 1250.00, email: 'e.reed@university.edu', students: 25 },
        { id: 2, name: 'Prof. Samuel Chen', earnings: 3400.50, email: 's.chen@university.edu', students: 68 },
        { id: 3, name: 'Dr. Aisha Khan', earnings: 875.75, email: 'a.khan@university.edu', students: 17 }
    ];

    const lecturerCtx = whiteboardCanvas.getContext('2d');
    const studentCtx = studentWhiteboardCanvas.getContext('2d');

    // --- Initial Flow ---
    const initializeStudentSession = () => {
        entryOverlay.classList.add('hidden');
        paymentOverlay.classList.remove('hidden');
        currentUserRole = 'student';
        switchPaymentMethod(currentPaymentMethod, { force: true });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const sessionSubject = urlParams.get('subject');
    const sessionFee = parseFloat(urlParams.get('fee'));

    if (sessionId) {
        currentSessionId = sessionId;
        if (sessionSubject) {
            currentClassSubject = sessionSubject;
        }
        if (!Number.isNaN(sessionFee)) {
            currentClassFee = sessionFee;
        }
        currentUserRole = 'student';
        switchPaymentMethod(currentPaymentMethod, { force: true });
        updatePaymentSummary();
        initializeStudentSession();
    } else {
        entryOverlay.classList.remove('hidden');
        entryStudentBtn.addEventListener('click', initializeStudentSession);
        entryLecturerBtn.addEventListener('click', () => {
            entryOverlay.classList.add('hidden');
            lecturerSignupOverlay.classList.remove('hidden');
            currentUserRole = 'lecturer';
        });
        entryAdminBtn.addEventListener('click', () => {
            entryOverlay.classList.add('hidden');
            adminLoginOverlay.classList.remove('hidden');
        });
    }

    adminBackBtn.addEventListener('click', () => {
        adminLoginOverlay.classList.add('hidden');
        entryOverlay.classList.remove('hidden');
    });

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-password').value;
        const errorEl = document.getElementById('admin-login-error');

        if (username === 'rowbiad_admin' && email === 'admin@rowbiad.com' && pass === 'password') {
            errorEl.textContent = '';
            adminLoginOverlay.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
            renderAdminDashboard();
        } else {
            errorEl.textContent = 'Invalid credentials. Please try again.';
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        adminDashboard.classList.add('hidden');
        entryOverlay.classList.remove('hidden');
    });

    lecturerSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lecturerName = lecturerNameSignup.value.trim();
        const lecturerEmail = document.getElementById('lecturer-email').value.trim();
        const classSubjectValue = classSubjectInput.value.trim();
        const classFeeValue = classFeeInput.value;
        const errorEl = document.getElementById('lecturer-signup-error');

        // Basic validation
        if (!lecturerName || !lecturerEmail || !classSubjectValue || classFeeValue === '') {
            errorEl.textContent = 'Please complete all fields before creating your class.';
            return;
        }

        const parsedFee = parseFloat(classFeeValue);
        if (Number.isNaN(parsedFee) || parsedFee < 0) {
            errorEl.textContent = 'Enter a valid class fee (0 or higher).';
            return;
        }

        errorEl.textContent = '';

        currentClassSubject = classSubjectValue;
        currentClassFee = parsedFee;
        lecturerNameDisplay.textContent = lecturerName;

        lecturerWelcomeMessage.textContent = `You are hosting a class on "${currentClassSubject}".`;
        currentSessionId = 'C' + Math.random().toString(36).substring(2, 9).toUpperCase();
        const currentUrl = new URL(window.location.href);
        currentUrl.search = '';
        currentUrl.searchParams.set('session', currentSessionId);
        currentUrl.searchParams.set('subject', currentClassSubject);
        currentUrl.searchParams.set('fee', currentClassFee.toFixed(2));
        currentUrl.searchParams.set('email', lecturerEmail);
        classLinkInput.value = currentUrl.href;

        lecturerSignupOverlay.classList.add('hidden');
        linkShareScreen.classList.remove('hidden');
    });

    const copyShareLink = (buttonElement) => {
        const textToCopy = classLinkInput.value;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = buttonElement.innerHTML;
            buttonElement.innerHTML = `<span>Copied!</span>`;
            const originalBgClass = buttonElement.classList.contains('bg-blue-600') ? 'bg-blue-600' : 'bg-gray-600';
            buttonElement.classList.replace(originalBgClass, 'bg-green-600');

            setTimeout(() => {
                buttonElement.innerHTML = originalHTML;
                buttonElement.classList.replace('bg-green-600', originalBgClass);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            const originalHTML = buttonElement.innerHTML;
            buttonElement.innerHTML = `<span>Failed!</span>`;
            const originalBgClass = buttonElement.classList.contains('bg-blue-600') ? 'bg-blue-600' : 'bg-gray-600';
            buttonElement.classList.replace(originalBgClass, 'bg-red-600');

            setTimeout(() => {
                buttonElement.innerHTML = originalHTML;
                buttonElement.classList.replace('bg-red-600', originalBgClass);
            }, 2000);
        });
    };

    const shareToWhatsApp = () => {
        if (!classLinkInput.value) return;
        const message = encodeURIComponent(`Join my virtual class on "${currentClassSubject}"! Click the link to join: ${classLinkInput.value}`);
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    copyLinkBtn.addEventListener('click', () => copyShareLink(copyLinkBtn));
    shareLinkBtn.addEventListener('click', () => copyShareLink(shareLinkBtn));
    whatsappShareBtnSetup.addEventListener('click', shareToWhatsApp);

    startClassBtn.addEventListener('click', () => {
        linkShareScreen.classList.add('hidden');
        initializeApp();
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        payButton.disabled = true;
        paymentStatus.textContent = 'Processing...';
        setTimeout(() => {
            paymentStatus.textContent = 'Payment Successful! Joining...';
            paymentOverlay.classList.add('hidden');
            initializeApp();
        }, 1500);
    });

    paymentMethodButtons.forEach((button) => {
        button.addEventListener('click', () => switchPaymentMethod(button.dataset.paymentMethod));
    });

    function switchPaymentMethod(method, options = { force: false }) {
        if (!options.force && currentPaymentMethod === method) return;
        currentPaymentMethod = method;

        paymentMethodButtons.forEach((button) => {
            const isActive = button.dataset.paymentMethod === method;
            button.classList.toggle('active', isActive);
        });

        paymentSections.forEach((section) => {
            const shouldShow = section.id === `payment-section-${method}`;
            section.classList.toggle('hidden', !shouldShow);
        });

        const metadata = paymentMethodMetadata[method];
        if (metadata) {
            paymentLogo.src = metadata.logoSrc;
            paymentLogo.alt = metadata.logoAlt;
            paymentLogo.classList.remove('hidden');
            paymentLogoFallbackText.classList.add('hidden');
            paymentInstruction.textContent = metadata.instruction || defaultPaymentInstruction;
        } else {
            paymentLogo.classList.add('hidden');
            paymentLogoFallbackText.classList.remove('hidden');
            paymentLogoFallbackText.textContent = method ? method.toUpperCase() : '';
            paymentInstruction.textContent = defaultPaymentInstruction;
        }

        updatePaymentSummary();
    }

    function initializeApp() {
        appContainer.classList.remove('hidden');
        setupRoleSpecificUI();
        setupLocalMedia();
        populateStudents();
        resizeCanvas();
        updatePaymentSummary();
        setupWhiteboard(lecturerCtx);
        setupWhiteboard(studentCtx);
        document.querySelector('.tool-btn[data-tool="pen"]').classList.add('active');
    }

    function setupRoleSpecificUI() {
        if (currentUserRole === 'lecturer') {
            studentPanel.classList.add('hidden');
            lecturerAssignmentPanel.classList.remove('hidden');
            lecturerControls.classList.remove('hidden');
            drawingToolbar.classList.remove('hidden');
            studentWhiteboardControls.classList.add('hidden');
            whiteboardCanvas.style.pointerEvents = 'auto';
            studentWhiteboardCanvas.style.pointerEvents = 'none';
            isStudentDrawing = false;
        } else {
            studentPanel.classList.remove('hidden');
            lecturerAssignmentPanel.classList.add('hidden');
            lecturerControls.classList.add('hidden');
            studentWhiteboardControls.classList.remove('hidden');
            setStudentDrawingMode(true);
            recordBtn.classList.remove('hidden');
        }
    }

    let localStream;
    async function setupLocalMedia() {
        try {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            userVideo.srcObject = localStream;
            lecturerVideo.srcObject = localStream;
            lecturerVideo.muted = true;
        } catch (err) {
            console.error('Media error:', err);
            alert('Could not access your camera and microphone. Please ensure they are not in use by another application and that you have granted permission. You may need to refresh the page to try again.');
        }
    }

    function populateStudents() {
        const students = [
            { name: 'Ben Carter' }, { name: 'Chloe Davis' },
            { name: 'Liam Garcia' }, { name: 'Zoe Martinez' },
            { name: 'Ava Rodriguez' }, { name: 'Noah Smith' },
            { name: 'Isabella Johnson' }, { name: 'James Williams' }
        ];
        participantCount.textContent = students.length + 1;
        students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'relative bg-gray-700 rounded-lg overflow-hidden aspect-video';
            card.innerHTML = `<img src="https://placehold.co/300x200/1f2937/9ca3af?text=${student.name.charAt(0)}" class="w-full h-full object-cover"><div class="absolute bottom-0 left-0 w-full bg-black/50 px-2 py-1"><span class="text-sm font-medium">${student.name}</span></div>`;
            participantsGrid.appendChild(card);
        });
    }

    function renderAdminDashboard() {
        payoutList.innerHTML = '';
        lecturerData.forEach(lecturer => {
            const payoutAmount = (lecturer.earnings * 0.70).toFixed(2);
            const card = document.createElement('div');
            card.className = 'bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4';
            card.innerHTML = `
                <div class="flex-1">
                    <h3 class="font-bold text-lg">${lecturer.name}</h3>
                    <p class="text-sm text-gray-400">${lecturer.email}</p>
                    <p class="text-sm text-gray-300 mt-1">Students: <span class="font-semibold text-white">${lecturer.students}</span></p>
                </div>
                <div class="text-left sm:text-right">
                    <p class="text-xl font-semibold">GHS ${lecturer.earnings.toFixed(2)}</p>
                    <p class="text-xs text-gray-300">Pending Payout: GHS ${payoutAmount}</p>
                </div>
                <button data-id="${lecturer.id}" class="pay-btn w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                    Pay 70%
                </button>
            `;
            payoutList.appendChild(card);
        });
    }

    payoutList.addEventListener('click', e => {
        if (e.target.classList.contains('pay-btn') && !e.target.disabled) {
            const lecturerId = parseInt(e.target.dataset.id, 10);
            const lecturer = lecturerData.find(l => l.id === lecturerId);
            if (lecturer) {
                const payout = lecturer.earnings * 0.70;
                lecturer.earnings *= 0.30;
                e.target.textContent = 'Paid!';
                e.target.disabled = true;
                setTimeout(() => {
                    alert(`GHS ${payout.toFixed(2)} successfully sent to ${lecturer.name}.`);
                    renderAdminDashboard();
                }, 500);
            }
        }
    });

    function setupWhiteboard(ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
    }

    function resizeCanvas() {
        const rect = whiteboardCanvas.parentElement.getBoundingClientRect();
        [whiteboardCanvas.width, studentWhiteboardCanvas.width] = [rect.width, rect.width];
        [whiteboardCanvas.height, studentWhiteboardCanvas.height] = [rect.height * 2, rect.height * 2];
    }
    window.addEventListener('resize', resizeCanvas);

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scrollContainer = canvas.parentElement;
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top + scrollContainer.scrollTop };
    }

    const channel = new BroadcastChannel('whiteboard-sync');
    channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'DRAW') {
            const targetCtx = payload.isStudentDrawing ? studentCtx : lecturerCtx;
            drawOnCanvas(targetCtx, payload.data);
        } else if (type === 'ASSIGNMENT') {
            if (currentUserRole === 'lecturer') {
                submittedAssignments.push(payload);
                updateAssignmentsList();
            }
        } else if (type === 'FILE_DISPLAY') {
            if (currentUserRole === 'student') {
                displayFileOnBoard(payload, false);
            }
        } else if (type === 'CLEAR') {
            lecturerCtx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
            studentCtx.clearRect(0, 0, studentWhiteboardCanvas.width, studentWhiteboardCanvas.height);
            whiteboardContent.innerHTML = '';
        }
    };

    function drawOnCanvas(ctx, data) {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.lineWidth;
        ctx.globalCompositeOperation = data.operation;

        if (data.type === 'start') {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        } else if (data.type === 'move') {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        } else if (data.type === 'text') {
            ctx.font = '20px Inter';
            ctx.fillStyle = data.color;
            ctx.globalCompositeOperation = 'source-over';
            ctx.textBaseline = 'top';
            data.textLines.forEach((line, index) => {
                ctx.fillText(line, data.x, data.y + (index * data.lineHeight));
            });
        }
    }

    function startDrawing(e) {
        if (e.target.tagName === 'TEXTAREA') return;
        const targetCanvas = (currentUserRole === 'lecturer') ? whiteboardCanvas : (isStudentDrawing ? studentWhiteboardCanvas : null);
        if (!targetCanvas || (e.target !== whiteboardContainer && e.target !== targetCanvas)) return;

        if (currentTool === 'text') {
            createTextAtPosition(e);
            return;
        }
        isDrawing = true;
        const pos = getMousePos(targetCanvas, e);
        [lastX, lastY] = [pos.x, pos.y];

        const drawData = {
            type: 'start',
            x: pos.x,
            y: pos.y,
            color: colorPicker.value,
            lineWidth: currentTool === 'eraser' ? 30 : 5,
            operation: currentTool === 'eraser' ? 'destination-out' : 'source-over'
        };

        const ctx = isStudentDrawing ? studentCtx : lecturerCtx;
        drawOnCanvas(ctx, drawData);
        channel.postMessage({ type: 'DRAW', payload: { isStudentDrawing, data: drawData } });
    }

    function draw(e) {
        if (!isDrawing) return;
        const targetCanvas = (currentUserRole === 'lecturer') ? whiteboardCanvas : (isStudentDrawing ? studentWhiteboardCanvas : null);
        if (!targetCanvas) return;

        const pos = getMousePos(targetCanvas, e);

        const drawData = {
            type: 'move',
            x: pos.x,
            y: pos.y,
            color: colorPicker.value,
            lineWidth: currentTool === 'eraser' ? 30 : 5,
            operation: currentTool === 'eraser' ? 'destination-out' : 'source-over'
        };

        const ctx = isStudentDrawing ? studentCtx : lecturerCtx;
        drawOnCanvas(ctx, drawData);
        channel.postMessage({ type: 'DRAW', payload: { isStudentDrawing, data: drawData } });
    }

    function createTextAtPosition(e) {
        if (tempTextInput) tempTextInput.blur();
        const currentCanvas = (currentUserRole === 'lecturer' || isStudentDrawing) ? (isStudentDrawing ? studentWhiteboardCanvas : whiteboardCanvas) : null;
        if (!currentCanvas) return;
        const pos = getMousePos(currentCanvas, e);
        const scrollContainer = currentCanvas.parentElement;

        tempTextInput = document.createElement('textarea');
        tempTextInput.style.position = 'absolute';
        tempTextInput.style.left = `${pos.x}px`;
        tempTextInput.style.top = `${pos.y}px`;
        tempTextInput.style.border = '1px dashed #4f46e5';
        tempTextInput.style.outline = 'none';
        tempTextInput.style.font = '20px Inter, sans-serif';
        tempTextInput.style.color = 'black';
        tempTextInput.style.background = 'rgba(255, 255, 255, 0.9)';
        tempTextInput.style.zIndex = '100';
        tempTextInput.style.padding = '2px';
        tempTextInput.style.resize = 'none';
        tempTextInput.style.overflow = 'hidden';
        tempTextInput.style.minHeight = '28px';
        tempTextInput.style.lineHeight = '1.2';

        scrollContainer.appendChild(tempTextInput);
        tempTextInput.focus();

        const lineHeight = 24;

        tempTextInput.addEventListener('blur', () => {
            if (tempTextInput.value) {
                const textData = {
                    type: 'text',
                    x: pos.x,
                    y: pos.y,
                    textLines: tempTextInput.value.split('\n'),
                    color: colorPicker.value,
                    lineHeight
                };
                const ctx = isStudentDrawing ? studentCtx : lecturerCtx;
                drawOnCanvas(ctx, textData);
                channel.postMessage({ type: 'DRAW', payload: { isStudentDrawing, data: textData } });
            }
            if (tempTextInput.parentElement) {
                scrollContainer.removeChild(tempTextInput);
            }
            tempTextInput = null;
        }, { once: true });
    }

    const whiteboardContainer = document.querySelector('.whiteboard-scroll-container');
    whiteboardContainer.addEventListener('mousedown', startDrawing);
    whiteboardContainer.addEventListener('mousemove', draw);
    whiteboardContainer.addEventListener('mouseup', () => { isDrawing = false; });
    whiteboardContainer.addEventListener('mouseleave', () => { isDrawing = false; });

    let isStudentDrawing = false;

    function setStudentDrawingMode(enabled) {
        isStudentDrawing = enabled;
        studentWhiteboardCanvas.style.pointerEvents = enabled ? 'auto' : 'none';
        whiteboardCanvas.style.pointerEvents = 'none';

        if (enabled) {
            drawingToolbar.classList.remove('hidden');
            studentDrawBtn.textContent = 'Stop Drawing';
            studentDrawBtn.classList.remove('bg-indigo-500');
            studentDrawBtn.classList.add('bg-red-600');
        } else {
            drawingToolbar.classList.add('hidden');
            studentDrawBtn.textContent = 'Draw on Whiteboard';
            studentDrawBtn.classList.remove('bg-red-600');
            studentDrawBtn.classList.add('bg-indigo-500');
        }
    }

    studentDrawBtn.addEventListener('click', () => {
        setStudentDrawingMode(!isStudentDrawing);
    });

    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.tool-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
        });
    });

    clearCanvasBtn.addEventListener('click', () => {
        clearConfirmOverlay.classList.remove('hidden');
    });

    confirmClearBtn.addEventListener('click', () => {
        clearConfirmOverlay.classList.add('hidden');
        lecturerCtx.clearRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
        studentCtx.clearRect(0, 0, studentWhiteboardCanvas.width, studentWhiteboardCanvas.height);
        whiteboardContent.innerHTML = '';
        channel.postMessage({ type: 'CLEAR' });
    });

    cancelClearBtn.addEventListener('click', () => {
        clearConfirmOverlay.classList.add('hidden');
    });

    clearConfirmOverlay?.addEventListener('click', (event) => {
        if (event.target === clearConfirmOverlay) {
            clearConfirmOverlay.classList.add('hidden');
        }
    });

    openFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            displayFileOnBoard(e.target.files[0], true);
            e.target.value = '';
        }
    });

    assignmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = assignmentFileInput.files[0];
        if (!file) return;

        const newSubmission = { studentName: 'You (Student)', file: file, fileName: file.name };

        channel.postMessage({ type: 'ASSIGNMENT', payload: newSubmission });

        assignmentStatusMsg.textContent = 'Submitted successfully!';
        setTimeout(() => { assignmentStatusMsg.textContent = ''; }, 3000);

        assignmentForm.reset();
    });

    function updateAssignmentsList() {
        if (submittedAssignments.length === 0) {
            assignmentsList.innerHTML = '<p class="text-gray-400 text-center py-4">No assignments submitted.</p>';
            return;
        }
        assignmentsList.innerHTML = '';
        submittedAssignments.forEach((sub, index) => {
            const el = document.createElement('div');
            el.className = 'bg-gray-700 p-2 rounded-lg flex justify-between items-center';
            el.innerHTML = `<div><p class="font-semibold text-sm">${sub.fileName}</p><p class="text-xs text-gray-400">${sub.studentName}</p></div>
                <button data-index="${index}" class="display-assignment-btn text-xs bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-700">Display</button>`;
            assignmentsList.appendChild(el);
        });
    }

    assignmentsList.addEventListener('click', (e) => {
        const btn = e.target.closest('.display-assignment-btn');
        if (btn) {
            const index = btn.dataset.index;
            displayFileOnBoard(submittedAssignments[index].file, true);
        }
    });

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function displayFileOnBoard(fileOrPayload, shouldBroadcast) {
        const isFileObject = fileOrPayload instanceof File;
        const file = isFileObject ? fileOrPayload : null;
        const payload = isFileObject ? null : fileOrPayload;

        if (shouldBroadcast) {
            whiteboardHistory.push(whiteboardContent.innerHTML);
        }

        whiteboardContent.innerHTML = '';

        if ((isFileObject && (file.type.startsWith('image/') || file.type.startsWith('video/'))) || (payload && payload.type.startsWith('media'))) {
            const fileUrl = isFileObject ? URL.createObjectURL(file) : payload.url;
            if ((isFileObject && file.type.startsWith('image/')) || (payload && payload.subType === 'image')) {
                const img = document.createElement('img');
                img.src = fileUrl;
                img.className = 'max-w-full h-auto rounded-lg mx-auto';
                whiteboardContent.appendChild(img);
                if (shouldBroadcast) channel.postMessage({ type: 'FILE_DISPLAY', payload: { type: 'media', subType: 'image', url: fileUrl } });
            } else {
                const video = document.createElement('video');
                video.src = fileUrl;
                video.className = 'max-w-full h-auto rounded-lg mx-auto';
                video.playsInline = true;

                if (shouldBroadcast) {
                    video.controls = true;
                    video.autoplay = false;
                    video.muted = false;
                } else {
                    video.controls = false;
                    video.autoplay = true;
                    video.muted = true; // ensure autoplay without user interaction
                    video.addEventListener('canplay', () => {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => {
                                // Autoplay might be blocked; show controls so the student can play manually
                                video.controls = true;
                                video.muted = false;
                            });
                        }
                    }, { once: true });
                }

                whiteboardContent.appendChild(video);
                if (shouldBroadcast) channel.postMessage({ type: 'FILE_DISPLAY', payload: { type: 'media', subType: 'video', url: fileUrl } });
            }
        } else if ((isFileObject && file.type === 'text/plain') || (payload && payload.type === 'text')) {
            const content = isFileObject ? null : payload.content;

            const renderText = (textContent) => {
                const textarea = document.createElement('textarea');
                textarea.value = textContent;
                textarea.className = 'editable-textarea';
                textarea.addEventListener('input', () => autoResizeTextarea(textarea));
                if (currentUserRole === 'lecturer') {
                    whiteboardContainer.style.pointerEvents = 'none';
                    textarea.addEventListener('focus', () => whiteboardContainer.style.pointerEvents = 'none');
                    textarea.addEventListener('blur', () => {
                        whiteboardContainer.style.pointerEvents = 'auto';
                    }, { once: true });
                } else {
                    textarea.readOnly = true;
                }
                whiteboardContent.appendChild(textarea);
                setTimeout(() => autoResizeTextarea(textarea), 0);
            };

            if (isFileObject) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    renderText(e.target.result);
                    if (shouldBroadcast) channel.postMessage({ type: 'FILE_DISPLAY', payload: { type: 'text', content: e.target.result } });
                };
                reader.readAsText(file);
            } else {
                renderText(content);
            }
        } else {
            whiteboardContent.innerHTML = '<p class="text-center text-red-400">Unsupported file type.</p>';
            if (shouldBroadcast) whiteboardHistory.pop();
            return;
        }
        if (shouldBroadcast) undoContainer.classList.remove('hidden');
    }

    undoBtn.addEventListener('click', () => {
        if (whiteboardHistory.length > 0) {
            const previousContent = whiteboardHistory.pop();

            const currentVideo = whiteboardContent.querySelector('video');
            if (currentVideo) {
                URL.revokeObjectURL(currentVideo.src);
            }

            whiteboardContent.innerHTML = previousContent;
            whiteboardContainer.style.pointerEvents = 'auto';
            whiteboardContent.querySelectorAll('.editable-textarea').forEach(textarea => {
                textarea.addEventListener('input', () => autoResizeTextarea(textarea));
                textarea.addEventListener('focus', () => whiteboardContainer.style.pointerEvents = 'none');
                textarea.addEventListener('blur', () => whiteboardContainer.style.pointerEvents = 'auto', { once: true });
                autoResizeTextarea(textarea);
            });
        }
        if (whiteboardHistory.length === 0) {
            undoContainer.classList.add('hidden');
        }
    });

    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = window.location.pathname;
        }
    });

    toggleMicBtn.addEventListener('click', () => {
        isMicOn = !isMicOn;
        document.getElementById('mic-on-icon').classList.toggle('hidden', !isMicOn);
        document.getElementById('mic-off-icon').classList.toggle('hidden', isMicOn);
        toggleMicBtn.classList.toggle('bg-blue-500', isMicOn);
        toggleMicBtn.classList.toggle('bg-gray-600', !isMicOn);
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = isMicOn);
        }
    });

    toggleCameraBtn.addEventListener('click', () => {
        isCameraOn = !isCameraOn;
        document.getElementById('cam-on-icon').classList.toggle('hidden', !isCameraOn);
        document.getElementById('cam-off-icon').classList.toggle('hidden', isCameraOn);
        toggleCameraBtn.classList.toggle('bg-blue-500', isCameraOn);
        toggleCameraBtn.classList.toggle('bg-gray-600', !isCameraOn);

        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = isCameraOn);
        }

        userVideo.classList.toggle('hidden', !isCameraOn);
        userCamOffPlaceholder.classList.toggle('hidden', isCameraOn);

        if (currentUserRole === 'lecturer') {
            lecturerVideo.classList.toggle('hidden', !isCameraOn);
            lecturerCamOffPlaceholder.classList.toggle('hidden', isCameraOn);
        }
    });

    raiseHandBtn.addEventListener('click', () => {
        isHandRaised = !isHandRaised;
        document.getElementById('raise-hand-text').textContent = isHandRaised ? 'Lower Hand' : 'Raise Hand';
        raiseHandBtn.classList.toggle('bg-yellow-500', !isHandRaised);
        raiseHandBtn.classList.toggle('bg-blue-600', isHandRaised);
        document.getElementById('user-participant-card').classList.toggle('hand-raised-indicator', isHandRaised);
        document.querySelector('#user-participant-card .hand-raise-icon').classList.toggle('hidden', !isHandRaised);
    });

    endCallBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to end the session?')) {
            window.location.href = window.location.pathname;
        }
    });

    async function startRecording() {
        try {
            if (!localStream || localStream.getAudioTracks().length === 0) {
                await setupLocalMedia();
                if (!localStream) throw new Error('Could not get microphone access.');
            }

            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' },
                audio: true
            });

            const audioContext = new AudioContext();
            const micSource = audioContext.createMediaStreamSource(localStream);
            const screenAudioSource = audioContext.createMediaStreamSource(displayStream);
            const destination = audioContext.createMediaStreamDestination();

            micSource.connect(destination);
            if (screenAudioSource.mediaStream.getAudioTracks().length > 0) {
                screenAudioSource.connect(destination);
            }

            const combinedStream = new MediaStream([
                displayStream.getVideoTracks()[0],
                destination.stream.getAudioTracks()[0]
            ]);

            recordedChunks = [];
            mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = url;
                a.download = `ROWBIAD-Recording-${new Date().toISOString()}.webm`;
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            };

            displayStream.getVideoTracks()[0].onended = () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    recordBtn.click();
                }
            };

            mediaRecorder.start();
        } catch (err) {
            console.error('Error starting recording:', err);
            alert('Could not start recording. Please ensure you grant permission for both screen and microphone.');
            isRecording = false;
            document.getElementById('record-text').textContent = 'Record';
            recordBtn.classList.replace('bg-red-600', 'bg-gray-600');
            recordingIndicator.classList.add('hidden');
        }
    }

    recordBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            document.getElementById('record-text').textContent = 'Stop';
            recordBtn.classList.replace('bg-gray-600', 'bg-red-600');
            recordingIndicator.classList.remove('hidden');
            startRecording();
        } else {
            document.getElementById('record-text').textContent = 'Record';
            recordBtn.classList.replace('bg-red-600', 'bg-gray-600');
            recordingIndicator.classList.add('hidden');
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }
    });
});