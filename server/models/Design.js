const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen es requerida']
    },
    publicId: {
        type: String,
        required: [true, 'El ID público de Cloudinary es requerido']
    },
    pageNumber: {
        type: Number,
        required: [true, 'El número de página es requerido'],
        unique: true
    },
    category: {
        type: String,
        enum: ['ilustración', 'diseño gráfico', 'fotografía', 'otros'],
        default: 'otros'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

designSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const maxPage = await this.constructor.findOne({}, 'pageNumber')
                .sort('-pageNumber')
                .exec();
            
            this.pageNumber = maxPage ? maxPage.pageNumber + 1 : 1;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

designSchema.statics.getAllActive = function() {
    return this.find({ isActive: true })
        .sort('pageNumber')
        .select('-__v');
};

designSchema.statics.updateDesign = function(id, updateData) {
    return this.findByIdAndUpdate(id, 
        { 
            ...updateData,
            updatedAt: Date.now()
        }, 
        { new: true, runValidators: true }
    );
};

designSchema.virtual('imageVersions').get(function() {
    if (!this.imageUrl) return null;
    
    return {
        thumbnail: this.imageUrl.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
        medium: this.imageUrl.replace('/upload/', '/upload/w_600,h_600,c_fill/'),
        large: this.imageUrl.replace('/upload/', '/upload/w_1200,h_1200,c_fill/')
    };
});

const Design = mongoose.model('Design', designSchema);

module.exports = Design;