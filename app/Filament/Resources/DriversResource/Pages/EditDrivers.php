<?php

namespace App\Filament\Resources\DriversResource\Pages;

use App\Filament\Resources\DriversResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDrivers extends EditRecord
{
    protected static string $resource = DriversResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
